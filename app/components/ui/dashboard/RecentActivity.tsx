import Link from "next/link";
import { ArrowRight, Plus, Settings } from "lucide-react";
import { Button } from "@/app/components/reusable/button";
import { Card } from "@/app/components/reusable/card";
import { DashboardActivitySummary } from "@/app/lib/definitions";

const formatPeso = (value: number) =>
    value.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
    });

export default function RecentActivity({
    activity,
}: {
    activity: DashboardActivitySummary;
}) {
    return (
        <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Today&apos;s Activity
            </h2>

            <Card className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">
                            Created
                        </p>
                        <p className="font-semibold">{activity.createdToday}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">
                            Completed
                        </p>
                        <p className="font-semibold">
                            {activity.completedToday}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">
                            Revenue
                        </p>
                        <p className="font-semibold">
                            {formatPeso(activity.revenueToday)}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">
                            Unpaid Pickup
                        </p>
                        <p className="font-semibold">{activity.unpaidPickup}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Link href="/new-ticket">
                        <Button size="sm">
                            <Plus className="size-4 mr-2" />
                            New Ticket
                        </Button>
                    </Link>
                    <Link href="/pickup">
                        <Button variant="outline" size="sm">
                            <ArrowRight className="size-4 mr-2" />
                            View Pickup
                        </Button>
                    </Link>
                    <Link href="/settings">
                        <Button variant="outline" size="sm">
                            <Settings className="size-4 mr-2" />
                            Settings
                        </Button>
                    </Link>
                </div>
            </Card>
        </section>
    );
}
