"use server";

import { cookies } from "next/headers";
import { createClient } from "@/app/utils/supabase/server";
import { getUserDetails } from "@/app/utils/supabase/queries";
import type { PersistedChatRole } from "@/app/utils/ai/messages";

const getSupabase = async () => {
    const cookieStore = await cookies();
    return createClient(cookieStore);
};

/**
 * Resolve the `full_name` of the currently authenticated technician so we can
 * write it into `ai_chat_threads.created_by` (which references
 * `profiles.full_name`).
 *
 * Throws if no user is logged in. The caller (chat service) maps this to a
 * 401 response.
 */
async function resolveCreatedBy(): Promise<string> {
    const supabase = await getSupabase();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
        throw new Error("UNAUTHENTICATED");
    }

    const profile = await getUserDetails(user.email);
    const fullName: string | null = profile?.full_name ?? null;

    if (!fullName) {
        throw new Error("MISSING_PROFILE_FULL_NAME");
    }

    return fullName;
}

export interface CreatedChatThread {
    id: string;
    ticket_id: string;
    title: string | null;
    summary: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Insert a new chat thread for a ticket. `created_by` is auto-resolved from
 * the current Supabase auth session.
 */
export async function createChatThread(
    ticketId: string,
): Promise<CreatedChatThread> {
    if (!ticketId) {
        throw new Error("ticketId is required");
    }

    const createdBy = await resolveCreatedBy();
    const supabase = await getSupabase();

    const { data, error } = await supabase.rpc("create_chat_thread", {
        p_ticket_id: ticketId,
        p_created_by: createdBy,
    });

    if (error) {
        console.error("Failed to create chat thread:", error.message);
        throw new Error("Failed to create chat thread.");
    }

    const rows = (data ?? []) as CreatedChatThread[];
    const row = rows[0];

    if (!row) {
        throw new Error("Failed to create chat thread.");
    }

    return row;
}

/**
 * Append one message to a thread. The RPC also bumps the thread's
 * `updated_at` atomically so the "Recent chats" list re-orders correctly.
 */
export async function appendChatMessage(
    threadId: string,
    role: PersistedChatRole,
    content: string,
): Promise<void> {
    if (!threadId) throw new Error("threadId is required");

    const supabase = await getSupabase();

    const { error } = await supabase.rpc("append_chat_message", {
        p_thread_id: threadId,
        p_role: role,
        p_content: content,
    });

    if (error) {
        console.error("Failed to append chat message:", error.message);
        throw new Error("Failed to save chat message.");
    }
}

export async function updateChatThreadTitle(
    threadId: string,
    title: string,
): Promise<void> {
    if (!threadId) throw new Error("threadId is required");
    const trimmed = title.trim();
    if (trimmed.length === 0) return;

    const supabase = await getSupabase();
    const { error } = await supabase.rpc("update_chat_thread_title", {
        p_thread_id: threadId,
        p_title: trimmed,
    });

    if (error) {
        console.error("Failed to update chat thread title:", error.message);
    }
}

export async function deleteChatThread(threadId: string): Promise<void> {
    if (!threadId) throw new Error("threadId is required");

    const supabase = await getSupabase();
    const { error } = await supabase.rpc("delete_chat_thread", {
        p_thread_id: threadId,
    });

    if (error) {
        console.error("Failed to delete chat thread:", error.message);
        throw new Error("Failed to delete chat thread.");
    }
}
