"use server";

import { cookies } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";
import type { ChatThreadSummary } from "@/app/components/ui/chatUI/types";
import type { ChatMessageRow } from "@/app/utils/ai/messages";

const getSupabase = async () => {
    const cookieStore = await cookies();
    return createClient(cookieStore);
};

export interface ChatThreadRow extends ChatThreadSummary {
    ticket_id: string;
    created_by: string | null;
    summarized_until_at: string | null;
}

/**
 * List the recent chat threads for a single ticket, newest first.
 * Used to populate the "Recent chats" dropdown on the chat page.
 */
export async function getChatThreadsByTicket(
    ticketId: string,
): Promise<ChatThreadSummary[]> {
    if (!ticketId) return [];

    const supabase = await getSupabase();
    const { data, error } = await supabase.rpc("get_chat_threads_by_ticket", {
        p_ticket_id: ticketId,
    });

    if (error) {
        console.error("Failed to load chat threads:", error.message);
        return [];
    }

    return (data ?? []) as ChatThreadSummary[];
}

/**
 * Fetch the full message history for a single thread, oldest first,
 * so the agent and the UI can replay it in order.
 */
export async function getChatMessages(
    threadId: string,
): Promise<ChatMessageRow[]> {
    if (!threadId) return [];

    const supabase = await getSupabase();
    const { data, error } = await supabase.rpc("get_chat_messages_by_thread", {
        p_thread_id: threadId,
    });

    if (error) {
        console.error("Failed to load chat messages:", error.message);
        return [];
    }

    return (data ?? []) as ChatMessageRow[];
}

/**
 * Load only the messages that came AFTER the running summary's watermark
 * for a thread. Pass `null` to load every message (e.g. when the thread has
 * never been summarized yet).
 */
export async function getChatMessagesByThreadAfter(
    threadId: string,
    after: string | null,
): Promise<ChatMessageRow[]> {
    if (!threadId) return [];

    const supabase = await getSupabase();
    const { data, error } = await supabase.rpc(
        "get_chat_messages_by_thread_after",
        {
            p_thread_id: threadId,
            p_after: after,
        },
    );

    if (error) {
        console.error(
            "Failed to load chat messages after watermark:",
            error.message,
        );
        return [];
    }

    return (data ?? []) as ChatMessageRow[];
}

/**
 * Look up a single thread by id. Used to validate that a `?thread=<uuid>`
 * URL parameter actually belongs to the current ticket before we trust it.
 */
export async function getChatThreadById(
    threadId: string,
): Promise<ChatThreadRow | null> {
    if (!threadId) return null;

    const supabase = await getSupabase();
    const { data, error } = await supabase.rpc("get_chat_thread_by_id", {
        p_thread_id: threadId,
    });

    if (error) {
        console.error("Failed to load chat thread:", error.message);
        return null;
    }

    const rows = (data ?? []) as ChatThreadRow[];
    return rows[0] ?? null;
}
