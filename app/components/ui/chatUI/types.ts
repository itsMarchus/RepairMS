export type ChatRole = "user" | "assistant" | "system" | "tool";

export type ChatMessageStatus = "streaming" | "done" | "error";

export interface ChatMessage {
    id: string;
    role: ChatRole;
    content: string;
    createdAt: number;
    status?: ChatMessageStatus;
}

export interface ChatRequestBody {
    threadId: string | null;
    message: string;
}

export interface ChatThreadSummary {
    id: string;
    title: string | null;
    summary: string | null;
    updated_at: string;
    created_at: string;
}
