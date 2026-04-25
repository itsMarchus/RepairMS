import type { AIMessageChunk } from "langchain";
import { agent, type ChatAgentContext } from "@/app/utils/ai/agent";
import { dbRowsToLangchain } from "@/app/utils/ai/messages";
import {
    getChatMessages,
    getChatThreadById,
} from "@/app/utils/supabase/chatQueries";
import {
    appendChatMessage,
    createChatThread,
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

    if (threadId) {
        const existing = await getChatThreadById(threadId);
        if (!existing || existing.ticket_id !== ticket.id) {
            throw new ChatServiceError(
                "Chat thread not found for this ticket.",
                404,
            );
        }
        activeThreadId = existing.id;
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

    const historyRows = await getChatMessages(activeThreadId);
    const langchainMessages = dbRowsToLangchain(historyRows);

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
                        const chunk = event.data?.chunk as AIMessageChunk | undefined;
                        const token = extractTokenText(chunk?.content);
                        if (token) {
                            assistantBuffer += token;
                            controller.enqueue(encoder.encode(token));
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
            }
        },
        cancel() {
            abortController.abort();
            signal.removeEventListener("abort", onUpstreamAbort);
        },
    });

    return { stream, threadId: activeThreadId };
}
