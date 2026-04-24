export type ChatRole = "user" | "assistant" | "system";

export type ChatMessageStatus = "streaming" | "done" | "error";

export interface ChatMessage {
    id: string;
    role: ChatRole;
    content: string;
    createdAt: number;
    status?: ChatMessageStatus;
}

export interface ChatRequestBody {
    messages: Array<Pick<ChatMessage, "role" | "content">>;
}
