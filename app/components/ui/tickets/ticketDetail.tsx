import { TicketDetailsType, TicketStatus } from "@/app/lib/definitions";
import Link from "next/link";
import { Button } from "@/app/components/reusable/button";
import { Card } from "@/app/components/reusable/card";
import { Badge } from "@/app/components/reusable/badge";
import { Textarea } from "@/app/components/reusable/textarea";
import { Label } from "@/app/components/reusable/label";
import {
    ArrowLeft,
    Phone,
    Mail,
    Camera,
    QrCode,
    Pencil,
} from "lucide-react";
import {
    getTicketAlertLevel,
    getTimeUntilDeadline,
} from "@/app/utils/ticketUtils";
import { getStatusFromSlug } from "@/app/utils/statusUtils";
import ImageModal from "@/app/components/reusable/imageModal";
import { formatLabel, formatMoney } from "@/app/utils/utils";
import { convertToLocalTimeReadable } from "@/app/utils/timezone";

export default async function TicketDetails({
    ticket,
}: {
    ticket: TicketDetailsType;
}) {
    const {
        ticket_number,
        customer_name,
        customer_phone,
        customer_email,
        device_type,
        device_brand,
        device_model,
        issue_description,
        technician_notes,
        est_time_repair,
        photo,
        created_at,
        updated_at,
        repair_cost,
        parts_cost,
        total_cost,
        paid,
        status,
    } = ticket;

    const alertLevel = getTicketAlertLevel({ est_time_repair, status });
    const alertBorders = {
        normal: "border-gray-200",
        warning: "border-yellow-400 border-2",
        danger: "border-red-400 border-2",
    };

    const [est_time_repair_local, created_at_local, updated_at_local] = await Promise.all([
        est_time_repair ? convertToLocalTimeReadable(est_time_repair as Date) : Promise.resolve("- -"),
        convertToLocalTimeReadable(created_at as Date),
        convertToLocalTimeReadable(updated_at as Date),
    ]);

    const paymentRows = Object.entries({ repair_cost, parts_cost, total_cost }).filter(
        ([_, value]) => typeof value === "number",
    );

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={`/${status}`}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-blue-50"
                                >
                                    <ArrowLeft className="size-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                    {ticket_number}
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {customer_name}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/ticket/${ticket_number}/checkout`}>
                                <Button
                                    variant="outline"
                                    className="hover:bg-blue-50 hover:border-blue-200"
                                >
                                    <QrCode className="size-4 md:mr-2" />
                                    <span className="hidden md:block">
                                        Checkout
                                    </span>
                                </Button>
                            </Link>
                            <Link href={`/ticket/${ticket_number}/edit`}>
                                <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-500/30">
                                    <Pencil className="size-4 md:mr-2" />
                                    <span className="hidden md:block">
                                        Edit
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Status Card */}
                        <Card className={`p-6 ${alertBorders[alertLevel]}`}>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-lg font-semibold">
                                    Status
                                </h2>
                                {alertLevel !== "normal" && (
                                    <Badge
                                        variant={
                                            alertLevel === "warning"
                                                ? "outline"
                                                : "destructive"
                                        }
                                    >
                                        {alertLevel === "warning"
                                            ? "Due Soon"
                                            : "Overdue"}
                                    </Badge>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label>Current Status</Label>
                                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                        {getStatusFromSlug(
                                            status as TicketStatus,
                                        )}
                                    </span>
                                </div>

                                <div>
                                    <Label>Estimated Completion</Label>
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            {est_time_repair_local}
                                        </span>
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
                                </div>
                            </div>
                        </Card>

                        {/* Device Information */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Device Information
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-600 dark:text-gray-400">
                                        Device Type
                                    </Label>
                                    <p className="font-medium">{device_type}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-600 dark:text-gray-400">
                                        Brand
                                    </Label>
                                    <p className="font-medium">
                                        {device_brand}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-gray-600 dark:text-gray-400">
                                        Model
                                    </Label>
                                    <p className="font-medium">
                                        {device_model}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Issue Description */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Issue Description
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">{issue_description}</p>
                        </Card>

                        {/* Technician Notes */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Technician Notes
                            </h2>
                            <Textarea
                                value={technician_notes}
                                placeholder="Add notes about the repair process..."
                                rows={4}
                                disabled={true}
                            />
                        </Card>

                        {/* Photos */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Photos
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    {photo && photo.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-3">
                                            <ImageModal
                                                src={photo}
                                                alt="Device Photo"
                                            />
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg p-8 text-center">
                                            <Camera className="size-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                No photos uploaded
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Customer
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-gray-600 dark:text-gray-400">
                                        Name
                                    </Label>
                                    <p className="font-medium">
                                        {customer_name}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-gray-600 dark:text-gray-400">
                                        Phone
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Phone className="size-4 text-gray-400 dark:text-gray-500" />
                                        <p className="font-medium">
                                            {customer_phone}
                                        </p>
                                    </div>
                                </div>
                                {customer_email && (
                                    <div>
                                        <Label className="text-gray-600 dark:text-gray-400">
                                            Email
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="size-4 text-gray-400 dark:text-gray-500" />
                                            <p className="font-medium text-sm">
                                                {customer_email}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full mt-4"
                                >
                                    <a href={`tel:${customer_phone}`}>
                                        <Phone className="size-4 mr-2" />
                                        Call Customer
                                    </a>
                                </Button>
                            </div>
                        </Card>

                        {/* Tracking */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Tracking
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-gray-600 dark:text-gray-400">
                                        Tracking ID
                                    </Label>
                                    <p className="font-mono text-sm">
                                        {ticket_number}
                                    </p>
                                </div>
                                <Link
                                    href={`/portal/${ticket_number}`}
                                    target="_blank"
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                    >
                                        View Customer Portal
                                    </Button>
                                </Link>
                            </div>
                        </Card>

                        {/* Payment */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Payment
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <Label className="pb-2">Repair Cost</Label>
                                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 dark:bg-slate-800">
                                                <tr>
                                                    <th className="px-3 py-2 text-left font-medium text-slate-600 dark:text-slate-300">
                                                        Item
                                                    </th>
                                                    <th className="px-3 py-2 text-right font-medium text-slate-600 dark:text-slate-300">
                                                        Amount
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                                {paymentRows.map(
                                                    ([key, value]) => (
                                                        <tr
                                                            key={key}
                                                            className={
                                                                key === "total"
                                                                    ? "bg-slate-50/70 dark:bg-slate-800/70"
                                                                    : ""
                                                            }
                                                        >
                                                            <td
                                                                className={`px-3 py-2 ${key === "total" ? "font-semibold text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}
                                                            >
                                                                {formatLabel(
                                                                    key,
                                                                )}
                                                            </td>
                                                            <td
                                                                className={`px-3 py-2 text-right ${key === "total" ? "font-semibold text-slate-900 dark:text-slate-100" : "font-medium"}`}
                                                            >
                                                                {formatMoney(
                                                                    value as number,
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <Badge
                                    variant={
                                        paid ? "default" : "secondary"
                                    }
                                    className="w-full justify-center"
                                >
                                    {paid ? "Paid" : "Unpaid"}
                                </Badge>
                            </div>
                        </Card>

                        {/* Timeline */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Timeline
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <Label className="text-gray-600 dark:text-gray-400">
                                        Created
                                    </Label>
                                    <p>
                                        {created_at_local}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-gray-600 dark:text-gray-400">
                                        Last Updated
                                    </Label>
                                    <p>
                                        {updated_at_local}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
