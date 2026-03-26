import { notFound } from "next/navigation";
import { Suspense } from "react";
import TicketPortal from "@/app/components/ui/tickets/ticketPortal";
import { getTicketPortalDetails } from "@/app/utils/supabase/queries";

export default async function PortalPage({
    params,
}: {
    params: Promise<{ ticket: string }>;
}) {
    const { ticket } = await params;

    if (!ticket) {
        notFound();
    }

    const { data, success } = await getTicketPortalDetails(ticket);
    if (!success || !data) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <Suspense>
                <TicketPortal ticket={data} />
            </Suspense>
        </main>
    )
}