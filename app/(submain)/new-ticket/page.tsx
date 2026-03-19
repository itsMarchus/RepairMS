import TicketAdd from "@/app/components/ui/tickets/ticketAdd";

// we can implement input and datalist for the customer name and phone number
export default function NewTicket() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <TicketAdd />
        </main>
    );
}