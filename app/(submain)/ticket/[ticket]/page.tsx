import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import TicketDetails from "@/app/components/ui/tickets/ticketDetail";
import { getTicketDetailsByNumber } from "@/app/utils/supabase/queries";

export const metadata: Metadata = {
    title: "Ticket Details",
    description: "View ticket details"
};

export default async function TicketDetailsPage({
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

        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <Suspense>
                    <TicketDetails ticket={data} />
                </Suspense>

                <Link
                    href={`/ticket/${encodeURIComponent(ticket)}/chat`}
                    aria-label="Open AI assistant"
                    title="Open AI assistant"
                    className="fixed bottom-6 right-6 z-30 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/40 transition-transform hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                >
                    <Sparkles className="size-6" />
                </Link>
            </main>
        )
    } catch (error) {
        console.error('Error fetching transaction:', error);
        notFound();
    }
}
