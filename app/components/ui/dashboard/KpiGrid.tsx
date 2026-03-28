import { Card } from "@/app/components/reusable/card";
import { DashboardKpi } from "@/app/lib/definitions";

const toneClassMap: Record<NonNullable<DashboardKpi["tone"]>, string> = {
    default: "border-slate-200 dark:border-slate-700",
    success: "border-emerald-300 dark:border-emerald-700/70",
    warning: "border-amber-300 dark:border-amber-700/70",
    danger: "border-red-300 dark:border-red-700/70",
};

export default function KpiGrid({ kpis }: { kpis: DashboardKpi[] }) {
    return (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {kpis.map((kpi) => (
                <Card
                    key={kpi.id}
                    className={`p-4 shadow-sm ${toneClassMap[kpi.tone ?? "default"]}`}
                >
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {kpi.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {kpi.value}
                    </p>
                    {kpi.hint ? (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {kpi.hint}
                        </p>
                    ) : null}
                </Card>
            ))}
        </section>
    );
}
