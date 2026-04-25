import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ChatView from "@/app/components/ui/chatUI/ChatView";
import type {
    ChatMessage,
    ChatThreadSummary,
} from "@/app/components/ui/chatUI/types";
import { getTicketDetailsByNumber } from "@/app/utils/supabase/queries";
import {
    getChatMessages,
    getChatThreadById,
    getChatThreadsByTicket,
} from "@/app/utils/supabase/chatQueries";
import { isPersistedRole, type ChatMessageRow } from "@/app/utils/ai/messages";

export const metadata: Metadata = {
    title: "AI Assistant",
    description: "AI diagnosis assistant for this ticket",
};

function rowsToChatMessages(rows: ChatMessageRow[]): ChatMessage[] {
    return rows
        .filter((row) => isPersistedRole(row.role) && row.role !== "system" && row.role !== "tool")
        .map((row) => {
            const createdAtMs = row.created_at
                ? new Date(row.created_at).getTime()
                : Date.now();
            return {
                id: row.id,
                role: row.role as ChatMessage["role"],
                content: row.content,
                createdAt: Number.isFinite(createdAtMs) ? createdAtMs : Date.now(),
                status: "done",
            } satisfies ChatMessage;
        });
}

async function resolveActiveThreadId(
    ticketId: string,
    requestedThreadId: string | undefined,
    forceNew: boolean,
    threads: ChatThreadSummary[],
): Promise<string | null> {
    if (requestedThreadId) {
        const thread = await getChatThreadById(requestedThreadId);
        if (thread && thread.ticket_id === ticketId) {
            return thread.id;
        }
        return null;
    }
    // Explicit "New chat" intent: force an empty conversation even when
    // recent threads exist for this ticket.
    if (forceNew) {
        return null;
    }
    return threads[0]?.id ?? null;
}

export default async function ChatPage({
    params,
    searchParams,
}: {
    params: Promise<{ ticket: string }>;
    searchParams: Promise<{ thread?: string; new?: string }>;
}) {
    const [{ ticket }, { thread: requestedThreadId, new: newParam }] =
        await Promise.all([params, searchParams]);

    if (!ticket) {
        notFound();
    }

    let ticketData: Awaited<ReturnType<typeof getTicketDetailsByNumber>>["data"];
    try {
        const result = await getTicketDetailsByNumber(ticket);
        if (!result.success || !result.data) {
            notFound();
        }
        ticketData = result.data;
    } catch (error) {
        console.error("Error loading chat page:", error);
        notFound();
    }

    const ticketDataResolved = ticketData!;
    const recentThreads = await getChatThreadsByTicket(ticketDataResolved.id);
    const forceNew = newParam === "1";
    const activeThreadId = await resolveActiveThreadId(
        ticketDataResolved.id,
        requestedThreadId,
        forceNew,
        recentThreads,
    );

    // If a `?thread=...` was specified but doesn't belong to this ticket
    // (e.g. stale link), drop the param so the user lands cleanly.
    if (requestedThreadId && activeThreadId === null) {
        redirect(`/ticket/${encodeURIComponent(ticket)}/chat`);
    }

    const messageRows = activeThreadId
        ? await getChatMessages(activeThreadId)
        : [];
    const initialMessages = rowsToChatMessages(messageRows);

    const summaryParts = [
        `Ticket ${ticketDataResolved.ticket_number}`,
        [ticketDataResolved.device_brand, ticketDataResolved.device_model]
            .filter(Boolean)
            .join(" ")
            .trim(),
        ticketDataResolved.issue_description,
    ].filter((part) => Boolean(part) && String(part).trim().length > 0);

    const ticketSummary = summaryParts.join(" - ");

    return (
        <ChatView
            key={activeThreadId ?? "new"}
            ticketNumber={ticket}
            ticketSummary={ticketSummary}
            initialThreadId={activeThreadId}
            initialMessages={initialMessages}
            recentThreads={recentThreads}
        />
    );
}
