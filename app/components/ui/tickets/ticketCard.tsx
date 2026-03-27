import { TicketCardType } from "@/app/lib/definitions";
import Link from "next/link";import { Smartphone, Laptop, Tablet, Clock, User, AlertCircle, Tv, Speaker, Cable } from 'lucide-react';
import { Card } from "@/app/components/reusable/card";
import { getTimeUntilDeadline, getTicketAlertLevel } from "@/app/utils/ticketUtils";
import { Badge } from "@/app/components/reusable/badge";
import { formatMoney } from "@/app/utils/utils";

export function TicketCard({ ticket }: { ticket: TicketCardType }) {
    const {
        ticket_number,
        customer_name,
        device_type,
        device_brand,
        device_model,
        issue_description,
        est_time_repair,
        status,
        total_cost,
        paid,
    } = ticket;

    const alertLevel = getTicketAlertLevel({ est_time_repair, status });

    const getDeviceIcon = (size: string) => {
        switch (device_type) {
            case "phone":
                return <Smartphone className={size} />;
            case "laptop":
                return <Laptop className={size} />;
            case "tablet":
                return <Tablet className={size} />;
            case "other":
                return <Cable className={size} />;
            case "tv":
                return <Tv className={size} />;
            case "speaker":
                return <Speaker className={size} />;
            default:
                return <Cable className={size} />;
        }
    };

    const alertColors = {
        normal: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-sky-300",
        warning:
            "bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700/70 hover:border-amber-400 dark:hover:border-amber-500",
        danger:
            "bg-white dark:bg-slate-900 border-red-300 dark:border-red-700/70 hover:border-red-400 dark:hover:border-red-500",
    };

    const alertGlow = {
        normal: "",
        warning: "shadow-md shadow-amber-200/40 dark:shadow-amber-900/20",
        danger: "shadow-md shadow-red-200/40 dark:shadow-red-900/20",
    };

    const deadlineAccent = {
        normal: "bg-slate-50 dark:bg-slate-800/80 border-slate-100 dark:border-slate-700",
        warning: "bg-amber-50 dark:bg-amber-900/15 border-amber-200 dark:border-amber-800/60",
        danger: "bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800/60",
    };

    return (
        <Link href={`/ticket/${ticket_number}`}>
            <Card
                className={`p-4 cursor-pointer hover:shadow-xl transition-all duration-200 ${alertColors[alertLevel]} ${alertGlow[alertLevel]} group`}
            >
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-sky-100 dark:group-hover:bg-sky-900/30 transition-colors">
                            {getDeviceIcon('size-4')}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                            {ticket_number}
                        </span>
                    </div>
                    {alertLevel !== "normal" && (
                        <div
                            className={`p-1 rounded-full ${
                                alertLevel === "warning"
                                    ? "bg-amber-100 dark:bg-amber-900/30"
                                    : "bg-red-100 dark:bg-red-900/30"
                            }`}
                        >
                            <AlertCircle
                                className={`size-4 ${
                                    alertLevel === "warning"
                                        ? "text-amber-600 dark:text-amber-300"
                                        : "text-red-600 dark:text-red-300"
                                }`}
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                        <User className="size-3.5 text-slate-500 dark:text-slate-400" />
                        <span>{customer_name}</span>
                    </div>

                    <div className="text-sm">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                            {device_brand} {device_model}
                        </div>
                        <div className="line-clamp-2 mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                            {issue_description}
                        </div>
                    </div>

                    <div
                        className={`flex items-center gap-2 text-xs mt-3 px-2 py-1.5 rounded-lg border ${deadlineAccent[alertLevel]}`}
                    >
                        <Clock className="size-3.5 text-slate-600 dark:text-slate-300" />
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                            {getTimeUntilDeadline(
                                est_time_repair,
                            )}
                        </span>
                    </div>

                    {total_cost > 0 && (
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                            <Badge
                                variant={paid ? "default" : "secondary"}
                                className="font-bold shadow-sm"
                            >
                                {formatMoney(total_cost)}
                            </Badge>
                            {!paid && status === "pickup" && (
                                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                                    Payment pending
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );
}
