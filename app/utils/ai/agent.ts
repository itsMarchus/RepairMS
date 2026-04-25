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

// Dedicated chat model used by the SummarizationMiddleware
const summaryModel = new ChatOllama({
    model: process.env.OLLAMA_MODEL ?? "gemma3",
    baseUrl: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
    temperature: 0,
    streaming: false,
    tags: ["summarization"],
});

// Prefix the middleware adds to the SystemMessage that contains the generated summary.
export const SUMMARY_PREFIX = "Summary of earlier conversation:";

// Number of messages to keep when summarizing.
export const SUMMARY_KEEP_MESSAGES = 12;

// Per-invocation context.
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
