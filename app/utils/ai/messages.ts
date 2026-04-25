import {
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
} from "langchain";

/**
 * Database row shape for `public.ai_chat_messages`.
 * (We deliberately keep this loose so it matches what the queries return.)
 */
export interface ChatMessageRow {
    id: string;
    thread_id?: string;
    role: string;
    content: string;
    created_at?: string | null;
}

/**
 * The roles allowed by the `ai_chat_messages_role_check` constraint.
 */
export type PersistedChatRole = "user" | "assistant" | "system" | "tool";

export const PERSISTED_ROLES: PersistedChatRole[] = [
    "user",
    "assistant",
    "system",
    "tool",
];

export function isPersistedRole(role: string): role is PersistedChatRole {
    return (PERSISTED_ROLES as string[]).includes(role);
}

/**
 * Convert one DB row into the matching LangChain `BaseMessage` subclass.
 * Tool messages need a `tool_call_id`; we don't currently persist that, so we
 * fall back to the row id (good enough for replay / display).
 */
export function dbRowToLangchain(row: ChatMessageRow): BaseMessage | null {
    const content = row.content ?? "";
    switch (row.role) {
        case "user":
            return new HumanMessage(content);
        case "assistant":
            return new AIMessage(content);
        case "system":
            return new SystemMessage(content);
        case "tool":
            return new ToolMessage({
                content,
                tool_call_id: row.id,
            });
        default:
            return null;
    }
}

export function dbRowsToLangchain(rows: ChatMessageRow[]): BaseMessage[] {
    return rows
        .map(dbRowToLangchain)
        .filter((m): m is BaseMessage => m !== null);
}

/**
 * Insert payload for `ai_chat_messages` — `thread_id` is added by the caller.
 */
export interface ChatMessageInsert {
    role: PersistedChatRole;
    content: string;
}

export function langchainToDbInsert(
    role: string,
    content: string,
): ChatMessageInsert {
    const safeRole: PersistedChatRole = isPersistedRole(role) ? role : "assistant";
    return { role: safeRole, content };
}
