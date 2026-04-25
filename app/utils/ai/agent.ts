import { ChatOllama } from "@langchain/ollama";
import {
    createAgent,
    dynamicSystemPromptMiddleware,
    summarizationMiddleware,
} from "langchain";
import { z } from "zod";
import { webSearchTool, youtubeSearchTool } from "@/app/utils/ai/tools";
import {
    BASE_SYSTEM_PROMPT,
    buildTicketContextBlock,
    type TicketContext,
} from "@/app/utils/ai/prompt";

const model = new ChatOllama({
    model: process.env.OLLAMA_MODEL ?? "gemma3",
    baseUrl: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
    temperature: 0.4,
});

/**
 * Dedicated chat model used by `summarizationMiddleware` for compressing
 * older messages. We use the same Ollama model (and therefore the same
 * cost/latency profile) but force `temperature: 0` for deterministic
 * summaries and tag every invocation so the chat service can filter the
 * leaked stream tokens out of the user-facing reply (see langchain JS
 * issue #9455 — the internal model.invoke() inside the middleware is
 * currently emitted on `on_chat_model_stream` like a normal model call).
 */
const summaryModel = new ChatOllama({
    model: process.env.OLLAMA_MODEL ?? "gemma3",
    baseUrl: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
    temperature: 0,
    streaming: false,
    tags: ["summarization"],
});

/**
 * Prefix the middleware adds to the SystemMessage that contains the
 * generated summary. Exported so the chat service can both (a) reinject
 * the persisted summary on the next turn and (b) reliably find the
 * summary message in the agent's final state.
 */
export const SUMMARY_PREFIX = "Summary of earlier conversation:";

/**
 * How many of the most recent messages the middleware preserves
 * verbatim when it summarizes. ~3 user/assistant turns plus tool calls.
 * The chat service uses the same constant to compute the watermark
 * after a summarization fires.
 */
export const SUMMARY_KEEP_MESSAGES = 12;

/**
 * Per-invocation context. The chat service passes the current ticket via
 * `agent.streamEvents(state, { context: { ticket } })`, and the dynamic
 * system-prompt middleware below pulls it back out to render the system
 * message for that single turn.
 *
 * Fields are nullable to match the DB (technician_notes, status, etc. can
 * be null on a freshly created ticket).
 */
export const chatContextSchema = z.object({
    ticket: z.object({
        ticket_number: z.string(),
        device_type: z.string().nullable().optional(),
        device_brand: z.string().nullable().optional(),
        device_model: z.string().nullable().optional(),
        issue_description: z.string().nullable().optional(),
        technician_notes: z.string().nullable().optional(),
        status: z.string().nullable().optional(),
    }),
});

export type ChatAgentContext = z.infer<typeof chatContextSchema>;

const ticketAwareSystemPrompt =
    dynamicSystemPromptMiddleware<ChatAgentContext>((_state, runtime) => {
        const ticket = runtime.context?.ticket as TicketContext | undefined;
        return `${BASE_SYSTEM_PROMPT}\n\n${buildTicketContextBlock(ticket ?? null)}`;
    });

const summarize = summarizationMiddleware({
    model: summaryModel,
    trigger: { tokens: 4000 },
    keep: { messages: SUMMARY_KEEP_MESSAGES },
    summaryPrefix: SUMMARY_PREFIX,
});

export const agent = createAgent({
    model,
    tools: [webSearchTool, youtubeSearchTool],
    contextSchema: chatContextSchema,
    middleware: [ticketAwareSystemPrompt, summarize],
});
