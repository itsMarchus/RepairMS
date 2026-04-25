import {
    type AIMessageChunk,
    type BaseMessage,
    SystemMessage,
} from "langchain";
import {
    agent,
    SUMMARY_KEEP_MESSAGES,
    SUMMARY_PREFIX,
    type ChatAgentContext,
} from "@/app/utils/ai/agent";
import { dbRowsToLangchain } from "@/app/utils/ai/messages";
import {
    getChatMessagesByThreadAfter,
    getChatThreadById,
    type ChatThreadRow,
} from "@/app/utils/supabase/chatQueries";
import {
    appendChatMessage,
    createChatThread,
    updateChatThreadSummary,
    updateChatThreadTitle,
} from "@/app/utils/supabase/chatActions";
import { getTicketDetailsByNumber } from "@/app/utils/supabase/queries";

export interface RunChatStreamArgs {
    ticketNumber: string;
    threadId: string | null;
    userMessage: string;
    /**
     * Abort signal from the inbound HTTP request. When the client navigates
     * away or aborts, we stop the agent and persist whatever partial
     * assistant text we already streamed.
     */
    signal: AbortSignal;
}

export interface RunChatStreamResult {
    stream: ReadableStream<Uint8Array>;
    threadId: string;
}

export class ChatServiceError extends Error {
    httpStatus: number;

    constructor(message: string, httpStatus: number) {
        super(message);
        this.httpStatus = httpStatus;
        this.name = "ChatServiceError";
    }
}

const MAX_TITLE_LENGTH = 80;

function truncateForTitle(value: string): string {
    const oneLine = value.replace(/\s+/g, " ").trim();
    if (oneLine.length <= MAX_TITLE_LENGTH) return oneLine;
    return `${oneLine.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…`;
}

function extractTokenText(content: AIMessageChunk["content"] | undefined): string {
    if (!content) return "";
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        let out = "";
        for (const part of content) {
            if (typeof part === "string") {
                out += part;
            } else if (
                part &&
                typeof part === "object" &&
                "type" in part &&
                part.type === "text" &&
                "text" in part &&
                typeof part.text === "string"
            ) {
                out += part.text;
            }
        }
        return out;
    }
    return "";
}

/**
 * Single orchestration entry point for the AI chat.
 *
 * It does everything the route used to do, but in one place:
 *   1. Validate input + load ticket.
 *   2. Resolve (or create) the chat thread for this ticket.
 *   3. Persist the user message before invoking the model.
 *   4. Auto-title brand-new threads from the first user message.
 *   5. Replay the full message history from DB into a LangChain agent.
 *   6. Stream tokens to the caller while accumulating the full assistant
 *      response.
 *   7. On stream completion / client abort / error, persist the assistant
 *      message (with a `[stopped]` marker if the user aborted mid-reply).
 *
 * The returned `{ stream, threadId }` lets the route surface the resolved
 * thread id via the `X-Thread-Id` header so the client can sync the URL.
 */
export async function runChatStream({
    ticketNumber,
    threadId,
    userMessage,
    signal,
}: RunChatStreamArgs): Promise<RunChatStreamResult> {
    const trimmedUserMessage = userMessage?.trim() ?? "";
    if (!ticketNumber) {
        throw new ChatServiceError("Missing ticket number.", 400);
    }
    if (trimmedUserMessage.length === 0) {
        throw new ChatServiceError("Message is required.", 400);
    }

    const ticketResult = await getTicketDetailsByNumber(ticketNumber);
    if (!ticketResult.success || !ticketResult.data) {
        throw new ChatServiceError("Ticket not found.", 404);
    }
    const ticket = ticketResult.data;

    let activeThreadId: string;
    let isNewThread = false;
    let existingThread: ChatThreadRow | null = null;

    if (threadId) {
        existingThread = await getChatThreadById(threadId);
        if (!existingThread || existingThread.ticket_id !== ticket.id) {
            throw new ChatServiceError(
                "Chat thread not found for this ticket.",
                404,
            );
        }
        activeThreadId = existingThread.id;
    } else {
        try {
            const created = await createChatThread(ticket.id);
            activeThreadId = created.id;
            isNewThread = true;
        } catch (error) {
            if (error instanceof Error && error.message === "UNAUTHENTICATED") {
                throw new ChatServiceError("You must be signed in.", 401);
            }
            console.error("Failed to create chat thread:", error);
            throw new ChatServiceError("Failed to start a new chat.", 500);
        }
    }

    try {
        await appendChatMessage(activeThreadId, "user", trimmedUserMessage);
    } catch (error) {
        console.error("Failed to persist user message:", error);
        throw new ChatServiceError("Failed to save your message.", 500);
    }

    if (isNewThread) {
        try {
            await updateChatThreadTitle(
                activeThreadId,
                truncateForTitle(trimmedUserMessage),
            );
        } catch (error) {
            console.error("Failed to auto-title chat thread:", error);
        }
    }

    // Watermark-aware load: only the messages that came AFTER the running
    // summary, plus the persisted summary reinjected as a SystemMessage so
    // the agent has full context without re-feeding ancient turns.
    const watermark = existingThread?.summarized_until_at ?? null;
    const previousSummary = existingThread?.summary?.trim() ?? "";
    const historyRows = await getChatMessagesByThreadAfter(
        activeThreadId,
        watermark,
    );

    const langchainMessages: BaseMessage[] = [];
    if (previousSummary.length > 0) {
        langchainMessages.push(
            new SystemMessage(`${SUMMARY_PREFIX}\n${previousSummary}`),
        );
    }
    langchainMessages.push(...dbRowsToLangchain(historyRows));

    const agentContext: ChatAgentContext = {
        ticket: {
            ticket_number: ticket.ticket_number,
            device_type: ticket.device_type ?? null,
            device_brand: ticket.device_brand ?? null,
            device_model: ticket.device_model ?? null,
            issue_description: ticket.issue_description ?? null,
            technician_notes: ticket.technician_notes ?? null,
            status: ticket.status ?? null,
        },
    };

    const abortController = new AbortController();
    const onUpstreamAbort = () => abortController.abort();
    signal.addEventListener("abort", onUpstreamAbort);

    const encoder = new TextEncoder();
    let assistantBuffer = "";
    // The agent's final state (set on every `on_chain_end` whose output
    // looks like the AgentState — i.e. has a `messages` array). The very
    // last update will be the top-level graph's final state, which is what
    // we want to scan for a freshly-generated summary SystemMessage.
    let finalStateMessages: BaseMessage[] | null = null;

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            let didError = false;
            try {
                const events = agent.streamEvents(
                    { messages: langchainMessages },
                    {
                        version: "v2",
                        context: agentContext,
                        signal: abortController.signal,
                    },
                );

                for await (const event of events) {
                    if (abortController.signal.aborted) break;

                    if (event.event === "on_chat_model_stream") {
                        // Skip tokens emitted by the summarization model so
                        // the user never sees the internal "Summary of
                        // earlier conversation:" text leak into the reply.
                        const tags = event.tags;
                        if (
                            Array.isArray(tags) &&
                            tags.includes("summarization")
                        ) {
                            continue;
                        }
                        const chunk = event.data?.chunk as
                            | AIMessageChunk
                            | undefined;
                        const token = extractTokenText(chunk?.content);
                        if (token) {
                            assistantBuffer += token;
                            controller.enqueue(encoder.encode(token));
                        }
                    } else if (event.event === "on_chain_end") {
                        const output = event.data?.output as
                            | { messages?: BaseMessage[] }
                            | undefined;
                        if (output && Array.isArray(output.messages)) {
                            finalStateMessages = output.messages;
                        }
                    }
                }
            } catch (error) {
                if (!abortController.signal.aborted) {
                    didError = true;
                    console.error("AI chat stream failed:", error);
                    try {
                        const errMsg =
                            "\n\n[An error occurred while generating a response. Please try again.]";
                        assistantBuffer += errMsg;
                        controller.enqueue(encoder.encode(errMsg));
                    } catch {
                        // controller already closed
                    }
                }
            } finally {
                signal.removeEventListener("abort", onUpstreamAbort);
                try {
                    controller.close();
                } catch {
                    // already closed
                }

                try {
                    let finalContent = assistantBuffer;
                    if (
                        abortController.signal.aborted &&
                        !didError &&
                        finalContent.length > 0
                    ) {
                        finalContent = `${finalContent}\n\n[stopped]`;
                    }
                    if (finalContent.trim().length > 0) {
                        await appendChatMessage(
                            activeThreadId,
                            "assistant",
                            finalContent,
                        );
                    }
                } catch (saveError) {
                    console.error(
                        "Failed to persist assistant message:",
                        saveError,
                    );
                }

                // Detect whether `summarizationMiddleware` produced a fresh
                // summary on this turn and, if so, persist it together with
                // the new watermark so the next turn skips everything it
                // already covered.
                try {
                    await maybePersistSummary({
                        threadId: activeThreadId,
                        finalStateMessages,
                        previousSummary,
                        historyRows,
                    });
                } catch (summaryError) {
                    console.error(
                        "Failed to persist chat summary:",
                        summaryError,
                    );
                }
            }
        },
        cancel() {
            abortController.abort();
            signal.removeEventListener("abort", onUpstreamAbort);
        },
    });

    return { stream, threadId: activeThreadId };
}

interface MaybePersistSummaryArgs {
    threadId: string;
    finalStateMessages: BaseMessage[] | null;
    previousSummary: string;
    historyRows: { created_at?: string | null }[];
}

/**
 * Inspect the agent's final state for a SystemMessage starting with
 * `SUMMARY_PREFIX`. If found, and either (a) we had no previous summary,
 * or (b) the new summary differs from the persisted one, write the new
 * summary plus the watermark of the last summarized message to the DB.
 *
 * The watermark is the `created_at` of the LAST historyRow that fell
 * outside the kept tail (`SUMMARY_KEEP_MESSAGES`), so the next call to
 * `getChatMessagesByThreadAfter` returns only what the new summary
 * doesn't already cover.
 */
async function maybePersistSummary({
    threadId,
    finalStateMessages,
    previousSummary,
    historyRows,
}: MaybePersistSummaryArgs): Promise<void> {
    if (!finalStateMessages || finalStateMessages.length === 0) return;

    const summaryMessage = [...finalStateMessages].reverse().find((m) => {
        if (!(m instanceof SystemMessage)) return false;
        const content = m.content;
        return (
            typeof content === "string" && content.startsWith(SUMMARY_PREFIX)
        );
    }) as SystemMessage | undefined;

    if (!summaryMessage) return;

    const rawContent = summaryMessage.content as string;
    const newSummary = rawContent
        .slice(SUMMARY_PREFIX.length)
        .replace(/^\s+/, "")
        .trim();

    if (newSummary.length === 0) return;
    if (newSummary === previousSummary) return; // nothing to do

    // Same arithmetic as `summarizationMiddleware`: with N input messages
    // and `keep = SUMMARY_KEEP_MESSAGES`, the middleware summarizes the
    // first (N - keep) messages. Whether we prepended a previous-summary
    // SystemMessage or not, the count of historyRows that fell into the
    // summarized window is exactly `historyRows.length - keep` (the
    // prepended SystemMessage is just an extra summarized item).
    const summarizedCount = historyRows.length - SUMMARY_KEEP_MESSAGES;
    if (summarizedCount <= 0) return;

    const lastSummarizedRow = historyRows[summarizedCount - 1];
    const newWatermark = lastSummarizedRow?.created_at;
    if (!newWatermark) return;

    await updateChatThreadSummary(threadId, newSummary, newWatermark);
}
