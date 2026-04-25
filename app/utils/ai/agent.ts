import { ChatOllama } from "@langchain/ollama";
import { createAgent, dynamicSystemPromptMiddleware } from "langchain";
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

export const agent = createAgent({
    model,
    tools: [webSearchTool, youtubeSearchTool],
    contextSchema: chatContextSchema,
    middleware: [ticketAwareSystemPrompt],
});
