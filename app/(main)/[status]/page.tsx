import { notFound } from "next/navigation";
import { TicketCard } from "@/app/components/ui/tickets/ticketCard";
import { TicketCardType } from "@/app/lib/definitions";
import { mockDataTicketCard } from "@/app/lib/mockdata";
import { getStatusFromSlug, isValidStatusSlug } from "@/app/utils/statusUtils";
import { TicketStatus } from "@/app/lib/definitions";

interface StatusPageProps {
    params: Promise<{ status: string }>;
}

export default async function StatusPage({ params }: StatusPageProps) {
    const { status: slug } = await params;

    if (!isValidStatusSlug(slug)) {
        notFound();
    }

    const status = getStatusFromSlug(slug as TicketStatus);
    const tickets = mockDataTicketCard.filter((ticket) => ticket.status === status);

    const statusConfig: Record<TicketStatus, { bg: string; accent: string; icon: string }> = {
        'queued': { bg: 'from-slate-100 to-slate-50', accent: 'bg-slate-500', icon: '⏱️' },
        'diagnosing': { bg: 'from-blue-100 to-blue-50', accent: 'bg-blue-500', icon: '🔍' },
        'waiting-for-parts': { bg: 'from-orange-100 to-orange-50', accent: 'bg-orange-500', icon: '📦' },
        'repairing': { bg: 'from-purple-100 to-purple-50', accent: 'bg-purple-500', icon: '🔧' },
        'pickup': { bg: 'from-emerald-100 to-emerald-50', accent: 'bg-emerald-500', icon: '✓' },
        'completed': { bg: 'from-slate-200 to-slate-100', accent: 'bg-slate-600', icon: '✓✓' }
    };

    return (
        <div className="flex-1 min-w-[300px]">
            <h1 className="text-2xl font-bold mb-4">{status}</h1>
            {tickets.length === 0 ? (
                <p className="text-slate-500">No tickets with this status.</p>
            ) : (
                <div className="space-y-4">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket as TicketCardType} />
                    ))}
                </div>
            )}
        </div>
    );
}
