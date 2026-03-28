import Link from "next/link";
import { Badge } from "@/app/components/reusable/badge";
import { Card } from "@/app/components/reusable/card";
import { DashboardStatusCount } from "@/app/lib/definitions";

export default function StatusPipeline({
    statusCounts,
}: {
    statusCounts: DashboardStatusCount[];
}) {

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Ticket Pipeline
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click any stage to view tickets
                </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {statusCounts.map((item) => (
                    <Link key={item.status} href={`/tickets?status=${item.status}`}>
                        <Card className="p-4 transition-colors hover:border-sky-300 dark:hover:border-sky-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{item.icon}</span>
                                    <p className="font-medium text-slate-800 dark:text-slate-100">
                                        {item.label}
                                    </p>
                                </div>
                                <Badge variant="secondary" className="font-bold">
                                    {item.count}
                                </Badge>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
