import { notFound } from "next/navigation";
import TicketEdit from "@/app/components/ui/tickets/ticketEdit";
import { TicketDetailsType } from "@/app/lib/definitions";
// import { mockDataCustomer, mockDataTicket, mockDataTicketDetail } from "@/app/lib/mockdata";

export default async function EditTicketPage({
    params,
} : {
    params: Promise<{ ticket: string }>;
}) {
    const { ticket } = await params;

    if (!ticket) {
        notFound();
    }

    // const baseTicket =
    //     mockDataTicket.find(
    //         (current) =>
    //             current.id === ticket || current.ticket_number === ticket,
    //     ) ?? (mockDataTicketDetail.id === ticket || mockDataTicketDetail.ticket_number === ticket ? mockDataTicketDetail : null);

    // if (!baseTicket) {
    //     notFound();
    // }

    // const customer = mockDataCustomer.find(
    //     (currentCustomer) => currentCustomer.id === baseTicket.customer_id,
    // );

    // const ticketDetails: TicketDetailsType = {
    //     ...mockDataTicketDetail,
    //     ...baseTicket,
    //     customer_name: customer?.name ?? mockDataTicketDetail.customer_name,
    //     customer_phone: customer?.phone ?? mockDataTicketDetail.customer_phone,
    //     customer_email: customer?.email ?? mockDataTicketDetail.customer_email,
    // };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* <TicketEdit ticket={ticketDetails} /> */}
        </main>
    );
}