/**
 * Static system prompt + ticket-context formatter for the AI diagnosis assistant.
 *
 * The base prompt is intentionally short and behavioral. The per-ticket block is
 * appended at request time by `dynamicSystemPromptMiddleware` in `agent.ts`,
 * which reads `runtime.context.ticket`.
 */

export const BASE_SYSTEM_PROMPT = [
    "You are an expert AI diagnostic assistant for a device repair shop.",
    "You help technicians diagnose devices, suggest troubleshooting steps, recommend parts, and draft concise technician notes.",
    "Be practical, step-by-step, and safety-aware. Prefer numbered steps and short paragraphs.",
    "Use the web_search or youtube_search tools when fresh information would meaningfully improve your answer (e.g. specific device firmware bugs, recall notices, repair videos).",
    "When you cite the web, cite the source URLs you actually used.",
    "If the user asks something off-topic from device repair, gently steer back to the ticket.",
].join(" ");

export interface TicketContext {
    ticket_number: string;
    device_type?: string | null;
    device_brand?: string | null;
    device_model?: string | null;
    issue_description?: string | null;
    technician_notes?: string | null;
    status?: string | null;
}

const cleanField = (value: string | null | undefined): string | null => {
    if (value === null || value === undefined) return null;
    const trimmed = String(value).trim();
    return trimmed.length === 0 ? null : trimmed;
};

export function buildTicketContextBlock(ticket: TicketContext | null | undefined): string {
    if (!ticket) {
        return "No ticket context is available for this conversation.";
    }

    const deviceType = cleanField(ticket.device_type);
    const brand = cleanField(ticket.device_brand);
    const model = cleanField(ticket.device_model);
    const status = cleanField(ticket.status);
    const issue = cleanField(ticket.issue_description);
    const notes = cleanField(ticket.technician_notes);

    const deviceLine = [brand, model].filter(Boolean).join(" ").trim();

    const lines: string[] = [
        "Current ticket context:",
        `- Ticket number: ${ticket.ticket_number}`,
    ];

    if (deviceType) lines.push(`- Device type: ${deviceType}`);
    if (deviceLine.length > 0) lines.push(`- Device: ${deviceLine}`);
    if (status) lines.push(`- Status: ${status}`);
    if (issue) lines.push(`- Reported issue: ${issue}`);
    if (notes) lines.push(`- Existing technician notes: ${notes}`);

    return lines.join("\n");
}
