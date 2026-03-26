import { TicketPortalType, TicketStatus } from "@/app/lib/definitions";
import { Progress } from "@/app/components/reusable/progress";
import {
    ArrowLeft,
    CheckCheck,
    CheckCircle2,
    Circle,
    Clock,
    Package,
    Smartphone,
    Wrench,
} from "lucide-react";
import { Card } from "@/app/components/reusable/card";
import { Badge } from "@/app/components/reusable/badge";
import { Button } from "@/app/components/reusable/button";
import Link from "next/link";
import { convertToLocalTimeReadable } from "@/app/utils/timezone";
import { getTicketAlertLevel, getTimeUntilDeadline } from "@/app/utils/ticketUtils";
// import { useRouter } from "next/navigation";
// import { formatInTimeZone } from "date-fns-tz";

const statusOrder: TicketStatus[] = [
    "queued",
    "diagnosing",
    "waiting-for-parts",
    "repairing",
    "pickup",
    "completed",
];

const statusLabels: Record<TicketStatus, string> = {
    queued: "Queued",
    diagnosing: "Diagnosing",
    "waiting-for-parts": "Waiting for Parts",
    repairing: "Repairing",
    pickup: "Ready for Pickup",
    completed: "Completed",
};

const getStageIcon = (status: TicketStatus) => {
    switch (status) {
        case "queued":
            return <Clock className="size-5" />;
        case "diagnosing":
            return <Smartphone className="size-5" />;
        case "waiting-for-parts":
            return <Package className="size-5" />;
        case "repairing":
            return <Wrench className="size-5" />;
        case "pickup":
            return <CheckCircle2 className="size-5" />;
        case "completed":
            return <CheckCheck className="size-5" />;
        default:
            return <Circle className="size-5" />;
    }
};

const getStatusIcon = (index: number, currentStatusIndex: number) => {
    if (index < currentStatusIndex) {
        return <CheckCircle2 className="size-6 text-green-500" />;
    }
    if (index === currentStatusIndex) {
        return <Circle className="size-6 text-blue-500 fill-blue-500" />;
    }
    return <Circle className="size-6 text-gray-300" />;
};

export default function TicketPortal({ ticket }: { ticket: TicketPortalType }) {
    // const router = useRouter();
    const {
        ticket_number,
        customer_name,
        status,
        device_type,
        device_brand,
        device_model,
        issue_description,
        est_time_repair,
    } = ticket;

    const normalizedStatus = statusOrder.includes(status)
        ? status
        : "queued";
    const currentStatusIndex = statusOrder.indexOf(normalizedStatus);
    const progressPercentage =
        currentStatusIndex >= 0
            ? ((currentStatusIndex + 1) / statusOrder.length) * 100
            : 0;

    const estimatedCompletion = est_time_repair ? convertToLocalTimeReadable(est_time_repair as Date, "EEEE, MMMM d, yyyy 'at' h:mm a") : "No estimated completion yet";

    const alertLevel = getTicketAlertLevel({ est_time_repair, status });
    const alertBorders = {
        normal: "border-gray-200",
        warning: "border-yellow-400 border-2",
        danger: "border-red-400 border-2",
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="hover:bg-blue-100">
                            <ArrowLeft className="size-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-3 rounded-xl shadow-lg shadow-blue-500/30">
                            <svg
                                className="size-8 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                        ToyexFix
                    </h1>
                    <p className="text-slate-600 text-lg">Track Your Repair</p>
                </div>

                <Card className="p-6 md:p-8 mb-6 shadow-2xl border-slate-200 bg-white/90 backdrop-blur-sm">
                    <div className="text-center mb-6">
                        <Badge
                            variant="outline"
                            className="text-lg px-5 py-2 mb-4 font-mono border-sky-300 text-sky-700 bg-sky-50"
                        >
                            {ticket_number}
                        </Badge>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            Hello, {customer_name}!
                        </h2>
                        <p className="text-slate-600">
                            Your {device_brand} {device_model} is currently being
                            repaired
                        </p>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold">
                                {Math.round(progressPercentage)}%
                            </span>
                        </div>
                        <Progress value={progressPercentage} className="h-3" />
                    </div>

                    <Card className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200 mb-8 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
                                {getStageIcon(normalizedStatus)}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-slate-800">
                                    {statusLabels[normalizedStatus]}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Current stage of your repair
                                </p>
                            </div>
                            {normalizedStatus === "pickup" && (
                                <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-green-500/30">
                                    Ready!
                                </Badge>
                            )}
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="font-semibold mb-4">Repair Timeline</h3>
                        {statusOrder.map((timelineStatus, index) => (
                            <div key={timelineStatus} className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                    {getStatusIcon(index, currentStatusIndex)}
                                    {index < statusOrder.length - 1 && (
                                        <div
                                            className={`w-0.5 h-12 ${
                                                index < currentStatusIndex
                                                    ? "bg-green-500"
                                                    : "bg-gray-300"
                                            }`}
                                        />
                                    )}
                                </div>
                                <div
                                    className={`flex-1 pb-8 ${
                                        index <= currentStatusIndex
                                            ? ""
                                            : "opacity-50"
                                    }`}
                                >
                                    <h4 className="font-medium">
                                        {statusLabels[timelineStatus]}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {index < currentStatusIndex &&
                                            "Completed"}
                                        {index === currentStatusIndex &&
                                            "In progress"}
                                        {index > currentStatusIndex &&
                                            "Upcoming"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6 mb-6 shadow-xl border-slate-200 bg-white/90 backdrop-blur-sm">
                    <h3 className="font-bold mb-4 text-slate-800">Device Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">Device</p>
                            <p className="font-medium">{device_type}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Brand & Model</p>
                            <p className="font-medium">
                                {device_brand} {device_model}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-600">Issue</p>
                            <p className="font-medium">{issue_description}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 mb-6 shadow-xl border-slate-200 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold mb-1 text-slate-800">
                                Estimated Completion
                            </h3>
                            <p className="text-sm text-gray-600">
                                {estimatedCompletion}
                            </p>
                            <Badge
                                variant={
                                    alertLevel === "danger"
                                    ? "destructive"
                                    : alertLevel === "warning"
                                    ? "outline"
                                    : "secondary"
                                }
                            >
                                {getTimeUntilDeadline(est_time_repair)}
                            </Badge>
                        </div>
                        <Clock className="size-8 text-blue-500" />
                    </div>
                </Card>

                {normalizedStatus === "pickup" && (
                    <Card className="p-8 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300 shadow-2xl">
                        <div className="text-center">
                            <div className="inline-flex p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-4 shadow-lg shadow-green-500/30">
                                <CheckCircle2 className="size-12 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-emerald-900 mb-2">
                                Your Device is Ready!
                            </h3>
                            <p className="text-emerald-800 text-lg">
                                Please visit our shop to pick up your device.
                            </p>
                        </div>
                    </Card>
                )}

                <div className="text-center mt-8 text-sm text-gray-600">
                    <p>Questions? Contact us at 09123456789</p>
                    <p className="mt-1">Tracking ID: {ticket_number}</p>
                </div>
            </div>
        </div>
    );
}