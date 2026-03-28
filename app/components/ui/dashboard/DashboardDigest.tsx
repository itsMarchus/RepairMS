import { DashboardKpi, DashboardStatusCount, DashboardActivitySummary, TicketCardType } from "@/app/lib/definitions";
import { Card } from "@/app/components/reusable/card";
import KpiGrid from "@/app/components/ui/dashboard/KpiGrid";
import RecentActivity from "@/app/components/ui/dashboard/RecentActivity";
import StatusPipeline from "@/app/components/ui/dashboard/StatusPipeline";
import UrgentList from "@/app/components/ui/dashboard/UrgentList";
import { convertToLocalTimeReadable } from "@/app/utils/timezone";

export default function DashboardDigest({
    kpis,
    statusCounts,
    urgentTickets,
    activity,
}: {
    kpis: DashboardKpi[];
    statusCounts: DashboardStatusCount[];
    urgentTickets: TicketCardType[];
    activity: DashboardActivitySummary;
}) {
    const lastUpdated = convertToLocalTimeReadable(new Date());

    return (
        <div className="space-y-6">
            <Card className="p-5 bg-gradient-to-br from-sky-50 to-blue-50/70 dark:from-slate-900 dark:to-slate-800 border-sky-200 dark:border-slate-700">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Daily Digest
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Overview of ticket health, workload, and operations.
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Last updated: {lastUpdated}
                </p>
            </Card>

            <KpiGrid kpis={kpis} />

            <StatusPipeline statusCounts={statusCounts} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
                <UrgentList tickets={urgentTickets} />
                <RecentActivity activity={activity} />
            </div>
        </div>
    );
}
