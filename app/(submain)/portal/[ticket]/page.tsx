import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TicketPortal from "@/app/components/ui/tickets/ticketPortal";
import { getTicketPortalDetails, getStoreDetails } from "@/app/utils/supabase/queries";

export const metadata: Metadata = {
    title: "Portal",
    description: "Track your repair"
};

export default async function PortalPage({
    params,
}: {
    params: Promise<{ ticket: string }>;
}) {
    const { ticket } = await params;

    if (!ticket) {
        notFound();
    }

    const [ticketDetails, storeDetails] = await Promise.all([
        getTicketPortalDetails(ticket),
        getStoreDetails(),
    ]);

    const { data: ticketData, success: ticketSuccess } = ticketDetails;
    const storeData = storeDetails;

    if (!ticketSuccess || !ticketData ) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <Suspense>
                <TicketPortal ticket={ticketData} store={storeData} />
            </Suspense>
        </main>
    )
}