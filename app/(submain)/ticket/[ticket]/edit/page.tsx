import { notFound } from "next/navigation";
import TicketEdit from "@/app/components/ui/tickets/ticketEdit";
import { Suspense } from "react";
import { getTicketDetailsByNumber } from "@/app/utils/supabase/queries";

export default async function EditTicketPage({
    params,
} : {
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
                    <TicketEdit ticket={data} />
                </Suspense>
            </main>
        )
    } catch (error) {
        console.error('Error fetching ticket:', error);
        notFound();
    }
}