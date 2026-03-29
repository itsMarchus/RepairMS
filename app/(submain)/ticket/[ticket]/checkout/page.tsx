import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TicketCheckout from "@/app/components/ui/tickets/ticketCheckout";
import { getTicketCheckoutDetails } from "@/app/utils/supabase/queries";

export const metadata: Metadata = {
    title: "Ticket Checkout",
    description: "Checkout your ticket"
};

export default async function CheckoutPage({
    params,
}: {
    params: Promise<{ ticket: string}>
}) {

    const { ticket } = await params;

    if (!ticket) {
        notFound();
    }

    try {
        const { data, success } = await getTicketCheckoutDetails(ticket);
        if (!success || !data) {
            notFound();
        }

        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <Suspense>
                    <TicketCheckout ticket={data} />
                </Suspense>
            </main>
        )
    } catch (error) {
        console.error('Error fetching checkout details:', error);
        notFound();
    }
}