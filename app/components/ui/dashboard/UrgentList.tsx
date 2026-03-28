import { TicketCard } from "@/app/components/ui/tickets/ticketCard";
import { TicketCardType } from "@/app/lib/definitions";

export default function UrgentList({
    tickets,
}: {
    tickets: TicketCardType[];
}) {
    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Priority Tickets
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Due soon and overdue items
                </p>
            </div>

            <div className="space-y-3">
                {tickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                ))}
                {tickets.length === 0 ? (
                    <p className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        No urgent tickets right now.
                    </p>
                ) : null}
            </div>
        </section>
    );
}
