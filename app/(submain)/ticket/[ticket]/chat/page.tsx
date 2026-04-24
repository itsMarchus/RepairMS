import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChatView from "@/app/components/ui/chatUI/ChatView";
import { getTicketDetailsByNumber } from "@/app/utils/supabase/queries";

export const metadata: Metadata = {
    title: "AI Assistant",
    description: "AI diagnosis assistant for this ticket",
};

export default async function ChatPage({
    params,
}: {
    params: Promise<{ ticket: string }>;
}) {
    const { ticket } = await params;

    if (!ticket) {
        notFound();
    }

    try {
        const { data, success } = await getTicketDetailsByNumber(ticket);
        if (!success || !data) {
            notFound();
        }

        const summaryParts = [
            `Ticket ${data.ticket_number}`,
            [data.device_brand, data.device_model].filter(Boolean).join(" ").trim(),
            data.issue_description,
        ].filter((part) => Boolean(part) && String(part).trim().length > 0);

        const ticketSummary = summaryParts.join(" - ");

        return <ChatView ticketNumber={ticket} ticketSummary={ticketSummary} />;
    } catch (error) {
        console.error("Error loading chat page:", error);
        notFound();
    }
}
