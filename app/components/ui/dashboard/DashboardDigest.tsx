import { DashboardDigestData } from "@/app/lib/definitions";
import { Card } from "@/app/components/reusable/card";
import KpiGrid from "@/app/components/ui/dashboard/KpiGrid";
import RecentActivity from "@/app/components/ui/dashboard/RecentActivity";
import StatusPipeline from "@/app/components/ui/dashboard/StatusPipeline";
import UrgentList from "@/app/components/ui/dashboard/UrgentList";

export default function DashboardDigest({
    data,
}: {
    data: DashboardDigestData;
}) {
    const lastUpdated = new Date(data.lastUpdatedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });

    return (
        <div className="space-y-6">
            <Card className="p-5 bg-gradient-to-br from-sky-50 to-blue-50/70 dark:from-slate-900 dark:to-slate-800 border-sky-200 dark:border-slate-700">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    {data.title}
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {data.subtitle}
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Last updated: {lastUpdated}
                </p>
            </Card>

            <KpiGrid kpis={data.kpis} />

            <StatusPipeline statusCounts={data.statusCounts} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
                <UrgentList tickets={data.urgentTickets} />
                <RecentActivity activity={data.activity} />
            </div>
        </div>
    );
}
