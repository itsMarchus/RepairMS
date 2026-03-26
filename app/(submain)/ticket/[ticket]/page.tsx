import { notFound } from "next/navigation";
import { Suspense } from "react"; 
import TicketDetails from "@/app/components/ui/tickets/ticketDetail";
import { getTicketDetailsByNumber } from "@/app/utils/supabase/queries";

export default async function TicketDetailsPage({
    params,
}: {
    params: Promise<{ ticket: string }>;
}) {

    const { ticket } = await params;
    
    if (!ticket) {
        notFound();
    } // TODO: add not-found.tsx

    try {
        const { data, success } = await getTicketDetailsByNumber(ticket);
        if (!success) {
            notFound();
        }

        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <Suspense>
                    <TicketDetails ticket={data} />
                </Suspense>
            </main>
        )
    } catch (error) {
        console.error('Error fetching transaction:', error);
        notFound();
    }
        //     return (
        //     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        //         <Suspense>
        //             <TicketDetails ticket={mockDataTicketDetail} />
        //         </Suspense>
        //     </main>
        // )
}
