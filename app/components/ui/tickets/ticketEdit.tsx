"use client";

import { FormEvent, useMemo, useState } from "react";
import { TicketDetailsType, TicketStatus } from "@/app/lib/definitions";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/reusable/button";
import { Card } from "@/app/components/reusable/card";
import { Badge } from "@/app/components/reusable/badge";
import { Textarea } from "@/app/components/reusable/textarea";
import { Input } from "@/app/components/reusable/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/reusable/select";
import { Label } from "@/app/components/reusable/label";
import {
    ArrowLeft,
    Phone,
    Mail,
    Camera,
    PhilippinePeso,
    Save,
} from "lucide-react";
import {
    getTicketAlertLevel,
    getTimeUntilDeadline,
} from "@/app/utils/ticketUtils";
import { statusSlugMap } from "@/app/utils/statusUtils";

type TicketEditFormValues = {
    status: TicketStatus;
    etr: string;
    technician_notes: string;
    repair_cost: string;
    parts_cost: string;
    tax: string;
    paid: "true" | "false";
};

function toDateTimeLocalString(value?: Date): string {
    if (!value) return "";
    return new Date(value).toISOString().slice(0, 16);
}

export default function TicketEdit({ ticket }: { ticket: TicketDetailsType }) {
    const router = useRouter();
    const [formValues, setFormValues] = useState<TicketEditFormValues>({
        status: ticket.status,
        etr: toDateTimeLocalString(ticket.etr),
        technician_notes: ticket.technician_notes ?? "",
        repair_cost: String(ticket.payment.repair_cost ?? 0),
        parts_cost: String(ticket.payment.parts_cost ?? 0),
        tax: String(ticket.payment.tax ?? 0),
        paid: ticket.payment.paid ? "true" : "false",
    });
    const [fieldErrors, setFieldErrors] = useState<
        Partial<Record<keyof TicketEditFormValues, string>>
    >({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const alertLevel = getTicketAlertLevel({
        etr: formValues.etr ? new Date(formValues.etr) : undefined,
        status: formValues.status,
    });
    const parsedRepairCost = Number(formValues.repair_cost || 0);
    const parsedPartsCost = Number(formValues.parts_cost || 0);
    const parsedTax = Number(formValues.tax || 0);
    const computedTotal = useMemo(
        () => parsedRepairCost + parsedPartsCost + parsedTax,
        [parsedRepairCost, parsedPartsCost, parsedTax],
    );

    const alertBorders = {
        normal: "border-gray-200",
        warning: "border-yellow-400 border-2",
        danger: "border-red-400 border-2",
    };

    const validateForm = () => {
        const errors: Partial<Record<keyof TicketEditFormValues, string>> = {};

        if (!Object.keys(statusSlugMap).includes(formValues.status)) {
            errors.status = "Please select a valid status.";
        }

        if (formValues.etr && Number.isNaN(new Date(formValues.etr).getTime())) {
            errors.etr = "Please enter a valid date and time.";
        }

        if (Number.isNaN(parsedRepairCost) || parsedRepairCost < 0) {
            errors.repair_cost = "Repair cost must be 0 or higher.";
        }
        if (Number.isNaN(parsedPartsCost) || parsedPartsCost < 0) {
            errors.parts_cost = "Parts cost must be 0 or higher.";
        }
        if (Number.isNaN(parsedTax) || parsedTax < 0) {
            errors.tax = "Tax must be 0 or higher.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError(null);

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/tickets/${ticket.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: formValues.status,
                    etr: formValues.etr ? new Date(formValues.etr).toISOString() : null,
                    technician_notes: formValues.technician_notes.trim() || null,
                    payment: {
                        repair_cost: parsedRepairCost,
                        parts_cost: parsedPartsCost,
                        tax: parsedTax,
                        paid: formValues.paid === "true",
                    },
                }),
            });

            if (!response.ok) {
                const data = (await response.json()) as {
                    error?: string;
                    fieldErrors?: Partial<Record<keyof TicketEditFormValues, string>>;
                };
                setSubmitError(data.error ?? "Failed to update ticket.");
                if (data.fieldErrors) {
                    setFieldErrors((previous) => ({
                        ...previous,
                        ...data.fieldErrors,
                    }));
                }
                return;
            }

            router.push(`/ticket/${ticket.id}`);
        } catch {
            setSubmitError("Something went wrong while saving the ticket.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={onSubmit}
            className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50"
        >
            <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={`/ticket/${ticket.id}`}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-blue-50"
                                    type="button"
                                >
                                    <ArrowLeft className="size-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                    {ticket.ticket_number}
                                </h1>
                                <p className="text-sm text-slate-600">
                                    {ticket.customer_name}
                                </p>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
                        >
                            <Save className="size-4 mr-2" />
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {submitError && (
                    <div className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {submitError}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <Card className={`p-6 ${alertBorders[alertLevel]}`}>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                <h2 className="text-lg font-semibold">Status</h2>
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
                                <div className="space-y-2">
                                    <Label htmlFor="status">Current Status</Label>
                                    <Select
                                        value={formValues.status}
                                        onValueChange={(value) =>
                                            setFormValues((previous) => ({
                                                ...previous,
                                                status: value as TicketStatus,
                                            }))
                                        }
                                    >
                                        <SelectTrigger
                                            id="status"
                                            aria-invalid={Boolean(fieldErrors.status)}
                                        >
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(statusSlugMap).map(
                                                ([value, label]) => (
                                                    <SelectItem
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {fieldErrors.status && (
                                        <p className="text-xs text-red-600">
                                            {fieldErrors.status}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="etr">Estimated Completion</Label>
                                    <div className="flex items-center justify-between gap-3">
                                        <Input
                                            id="etr"
                                            type="datetime-local"
                                            value={formValues.etr}
                                            onChange={(event) =>
                                                setFormValues((previous) => ({
                                                    ...previous,
                                                    etr: event.target.value,
                                                }))
                                            }
                                            aria-invalid={Boolean(fieldErrors.etr)}
                                        />
                                        <Badge
                                            variant={
                                                alertLevel === "danger"
                                                    ? "destructive"
                                                    : alertLevel === "warning"
                                                      ? "outline"
                                                      : "secondary"
                                            }
                                        >
                                            {getTimeUntilDeadline(
                                                formValues.etr
                                                    ? new Date(formValues.etr)
                                                    : undefined,
                                            )}
                                        </Badge>
                                    </div>
                                    {fieldErrors.etr && (
                                        <p className="text-xs text-red-600">
                                            {fieldErrors.etr}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
                                Device Information
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-600">
                                        Device Type
                                    </Label>
                                    <Input value={ticket.device_type} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-600">Brand</Label>
                                    <Input value={ticket.device_brand} disabled />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-gray-600">Model</Label>
                                    <Input value={ticket.device_model} disabled />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
                                Issue Description
                            </h2>
                            <Textarea value={ticket.issue_description} disabled />
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
                                Technician Notes
                            </h2>
                            <div className="space-y-2">
                                <Textarea
                                    id="technician-notes"
                                    value={formValues.technician_notes}
                                    onChange={(event) =>
                                        setFormValues((previous) => ({
                                            ...previous,
                                            technician_notes: event.target.value,
                                        }))
                                    }
                                    placeholder="Add notes about the repair process..."
                                    rows={4}
                                    aria-invalid={Boolean(fieldErrors.technician_notes)}
                                />
                                {fieldErrors.technician_notes && (
                                    <p className="text-xs text-red-600">
                                        {fieldErrors.technician_notes}
                                    </p>
                                )}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
                                Photos
                            </h2>
                            {ticket.photo ? (
                                <Image
                                    src={ticket.photo}
                                    alt="Device Photo"
                                    width={1280}
                                    height={720}
                                    className="w-full h-56 object-cover rounded-lg border border-slate-200"
                                />
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <Camera className="size-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">
                                        No photos uploaded
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
                                Customer
                            </h2>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-gray-600">Name</Label>
                                    <Input value={ticket.customer_name} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-600">Phone</Label>
                                    <div className="flex items-center gap-2">
                                        <Phone className="size-4 text-gray-400" />
                                        <Input value={ticket.customer_phone} disabled />
                                    </div>
                                </div>
                                {ticket.customer_email && (
                                    <div className="space-y-2">
                                        <Label className="text-gray-600">Email</Label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="size-4 text-gray-400" />
                                            <Input value={ticket.customer_email} disabled />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
                                Tracking
                            </h2>
                            <div className="space-y-2">
                                <Label className="text-gray-600">
                                    Tracking ID
                                </Label>
                                <p className="font-mono text-sm">
                                    {ticket.ticket_number}
                                </p>
                                <Link
                                    href={`/customer/${ticket.ticket_number}`}
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

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
                                Payment
                            </h2>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="repair-cost">Repair Cost</Label>
                                    <div className="flex items-center gap-2">
                                        <PhilippinePeso className="size-4 text-gray-400" />
                                        <Input
                                            id="repair-cost"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={formValues.repair_cost}
                                            onChange={(event) =>
                                                setFormValues((previous) => ({
                                                    ...previous,
                                                    repair_cost: event.target.value,
                                                }))
                                            }
                                            aria-invalid={Boolean(
                                                fieldErrors.repair_cost,
                                            )}
                                        />
                                    </div>
                                    {fieldErrors.repair_cost && (
                                        <p className="text-xs text-red-600">
                                            {fieldErrors.repair_cost}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="parts-cost">Parts Cost</Label>
                                    <div className="flex items-center gap-2">
                                        <PhilippinePeso className="size-4 text-gray-400" />
                                        <Input
                                            id="parts-cost"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={formValues.parts_cost}
                                            onChange={(event) =>
                                                setFormValues((previous) => ({
                                                    ...previous,
                                                    parts_cost: event.target.value,
                                                }))
                                            }
                                            aria-invalid={Boolean(
                                                fieldErrors.parts_cost,
                                            )}
                                        />
                                    </div>
                                    {fieldErrors.parts_cost && (
                                        <p className="text-xs text-red-600">
                                            {fieldErrors.parts_cost}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tax">Tax</Label>
                                    <div className="flex items-center gap-2">
                                        <PhilippinePeso className="size-4 text-gray-400" />
                                        <Input
                                            id="tax"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={formValues.tax}
                                            onChange={(event) =>
                                                setFormValues((previous) => ({
                                                    ...previous,
                                                    tax: event.target.value,
                                                }))
                                            }
                                            aria-invalid={Boolean(fieldErrors.tax)}
                                        />
                                    </div>
                                    {fieldErrors.tax && (
                                        <p className="text-xs text-red-600">
                                            {fieldErrors.tax}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Total</Label>
                                    <Input
                                        value={computedTotal.toLocaleString(
                                            "en-PH",
                                            {
                                                style: "currency",
                                                currency: "PHP",
                                            },
                                        )}
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="paid">Payment Status</Label>
                                    {/* <Select
                                        value={formValues.paid}
                                        onValueChange={(value) =>
                                            setFormValues((previous) => ({
                                                ...previous,
                                                paid: value as "true" | "false",
                                            }))
                                        }
                                    >
                                        <SelectTrigger id="paid">
                                            <SelectValue placeholder="Select payment status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="false">
                                                Unpaid
                                            </SelectItem>
                                            <SelectItem value="true">
                                                Paid
                                            </SelectItem>
                                        </SelectContent>
                                    </Select> */}
                                    <Badge variant={ticket.payment.paid ? 'default' : 'secondary'} className="w-full justify-center">
                                        {ticket.payment.paid ? 'Paid' : 'Unpaid'}
                                    </Badge>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200">
                                Timeline
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="space-y-2">
                                    <Label className="text-gray-600">
                                        Created
                                    </Label>
                                    <Input
                                        value={new Date(
                                            ticket.timeline.created_at,
                                        ).toLocaleString()}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-600">
                                        Last Updated
                                    </Label>
                                    <Input
                                        value={new Date(
                                            ticket.timeline.updated_at,
                                        ).toLocaleString()}
                                        disabled
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </form>
    );
}