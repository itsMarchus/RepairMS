"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { TicketDetailsType, TicketStatus } from "@/app/lib/definitions";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/components/reusable/dialog";
import { deleteTicket, updateTicket } from "@/app/utils/supabase/action";
import type { ticketState } from "@/app/utils/supabase/action";
import {
    ArrowLeft,
    Phone,
    Mail,
    Camera,
    PhilippinePeso,
    Save,
    Trash,
} from "lucide-react";
import {
    getTicketAlertLevel,
    getTimeUntilDeadline,
} from "@/app/utils/ticketUtils";
import { statusSlugMap } from "@/app/utils/statusUtils";
import { format } from 'date-fns';

const fieldError = (errors: ticketState["errors"], key: keyof ticketState["errors"]) =>
    errors[key]?.[0] ?? null;

export default function TicketEdit({ ticket }: { ticket: TicketDetailsType }) {
    const router = useRouter();
    const {
        id,
        ticket_number,
        customer_name,
        customer_phone,
        customer_email,
        device_type,
        device_brand,
        device_model,
        issue_description,
        photo,
        created_at,
        updated_at,
        paid
    } = ticket;
    const [ status, setStatus ] = useState(ticket.status);
    const [ est_time_repair, setEstTimeRepair ] = useState(ticket.est_time_repair);
    const [ technician_notes, setTechnicianNotes ] = useState(ticket.technician_notes);
    const [ repair_cost, setRepairCost ] = useState(ticket.repair_cost ?? 0);
    const [ parts_cost, setPartsCost ] = useState(ticket.parts_cost ?? 0);


    const initialState: ticketState = {
        errors: {},
        success: false,
        message: null,
    };
    const updateTicketWithId = updateTicket.bind(null, id);
    const [state, formAction, isPending] = useActionState(updateTicketWithId, initialState);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const alertLevel = getTicketAlertLevel({
        est_time_repair,
        status,
    });
    const parsedRepairCost = Number(repair_cost ?? 0);
    const parsedPartsCost = Number(parts_cost ?? 0);
    const computedTotal = useMemo(
        () => parsedRepairCost + parsedPartsCost,
        [parsedRepairCost, parsedPartsCost],
    );

    const alertBorders = {
        normal: "border-gray-200",
        warning: "border-yellow-400 border-2",
        danger: "border-red-400 border-2",
    };

    useEffect(() => {
        if (!state.message) {
            return;
        }

        if (state.success) {
            toast.success(state.message);
            const timeout = setTimeout(() => {
                router.push(`/ticket/${ticket_number}`);
                router.refresh();
            }, 700);

            return () => clearTimeout(timeout);
        }

        toast.error(state.message);
    }, [router, state.message, state.success, ticket_number]);

    const handleDeleteTicket = async () => {
        if (isDeleting) {
            return;
        }

        setIsDeleting(true);
        const result = await deleteTicket(id);

        if (result.success) {
            toast.success(result.message ?? "Ticket deleted successfully.");
            setIsDeleteDialogOpen(false);
            router.replace(`/${status}`);
            return;
        }

        toast.error(result.message ?? "Failed to delete ticket. Please try again.");
        setIsDeleting(false);
    };

    return (
        <form
            action={formAction}
            className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
        >
            <input type="hidden" name="status" value={status} />
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={`/ticket/${ticket_number}`}>
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
                                    {ticket_number}
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {customer_name}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Dialog
                                open={isDeleteDialogOpen}
                                onOpenChange={(open) => {
                                    if (isDeleting && !open) {
                                        return;
                                    }
                                    setIsDeleteDialogOpen(open);
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="hover:bg-red-700"
                                        type="button"
                                        disabled={isDeleting}
                                    >
                                        <Trash className="size-4 md:mr-2" />
                                        <span className="hidden md:block">
                                            Delete
                                        </span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Delete this ticket permanently?</DialogTitle>
                                        <DialogDescription>
                                            You are about to delete ticket {ticket_number}. This action
                                            cannot be undone and all tracking data for this ticket will be
                                            removed.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline" disabled={isDeleting}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={handleDeleteTicket}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? "Deleting..." : "Yes, delete ticket"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
                            >
                                <Save className="size-4 md:mr-2" />
                                <span className="hidden md:block">
                                    {isPending ? "Saving..." : "Save Changes"}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {state.message ? (
                    <p
                        className={`mb-6 rounded-lg border px-3 py-2 text-sm ${
                            Object.keys(state.errors).length > 0
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                    >
                        {state.message}
                    </p>
                ) : null}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <Card className={`p-6 ${alertBorders[alertLevel]}`}>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
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
                                        value={status}
                                        onValueChange={(value) =>
                                            setStatus(value as TicketStatus)
                                        }
                                    >
                                        <SelectTrigger
                                            id="status"
                                            aria-invalid={Boolean(fieldError(state.errors, "status"))}
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
                                    {fieldError(state.errors, "status") ? (
                                        <p className="text-xs text-red-600">
                                            {fieldError(state.errors, "status")}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="etr">Estimated Completion</Label>
                                    <div className="flex items-center justify-between gap-3">
                                        <Input
                                            id="etr"
                                            type="datetime-local"
                                            value={est_time_repair ? format(new Date(est_time_repair), 'yyyy-MM-dd\'T\'HH:mm') : ''}
                                            onChange={(event) => {
                                                if (!event.target.value) {
                                                    setEstTimeRepair(undefined);
                                                    return;
                                                }
                                                setEstTimeRepair(new Date(event.target.value));
                                            }}
                                            aria-invalid={Boolean(fieldError(state.errors, "est_time_repair"))}
                                        />
                                        <input type="hidden" name="est_time_repair" value={est_time_repair ? new Date(est_time_repair).toISOString() : ''} />
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
                                    {fieldError(state.errors, "est_time_repair") ? (
                                        <p className="text-xs text-red-600">
                                            {fieldError(state.errors, "est_time_repair")}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Device Information
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-600 dark:text-gray-400">
                                        Device Type
                                    </Label>
                                    <Input value={device_type} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-600 dark:text-gray-400">Brand</Label>
                                    <Input value={device_brand} disabled />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-gray-600 dark:text-gray-400">Model</Label>
                                    <Input value={device_model ?? ""} disabled />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Issue Description
                            </h2>
                            <Textarea value={issue_description} disabled />
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Technician Notes
                            </h2>
                            <div className="space-y-2">
                                <Textarea
                                    id="technician-notes"
                                    name="technician_notes"
                                    value={technician_notes ?? ""}
                                    onChange={(event) => setTechnicianNotes(event.target.value)}
                                    placeholder="Add notes about the repair process..."
                                    rows={4}
                                    aria-invalid={Boolean(fieldError(state.errors, "technician_notes"))}
                                />
                                {fieldError(state.errors, "technician_notes") ? (
                                    <p className="text-xs text-red-600">
                                        {fieldError(state.errors, "technician_notes")}
                                    </p>
                                ) : null}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Photos
                            </h2>
                            {photo ? (
                                <Image
                                    src={photo}
                                    alt="Device Photo"
                                    width={1280}
                                    height={720}
                                    className="w-full h-56 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                                />
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg p-8 text-center">
                                    <Camera className="size-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        No photos uploaded
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Customer
                            </h2>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-gray-600 dark:text-gray-400">Name</Label>
                                    <Input value={customer_name} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-600 dark:text-gray-400">Phone</Label>
                                    <div className="flex items-center gap-2">
                                        <Phone className="size-4 text-gray-400 dark:text-gray-500" />
                                        <Input value={customer_phone} disabled />
                                    </div>
                                </div>
                                {customer_email && (
                                    <div className="space-y-2">
                                        <Label className="text-gray-600 dark:text-gray-400">Email</Label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="size-4 text-gray-400 dark:text-gray-500" />
                                            <Input value={customer_email} disabled />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Tracking
                            </h2>
                            <div className="space-y-2">
                                <Label className="text-gray-600 dark:text-gray-400">
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
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Payment
                            </h2>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="repair-cost">Repair Cost</Label>
                                    <div className="flex items-center gap-2">
                                        <PhilippinePeso className="size-4 text-gray-400 dark:text-gray-500" />
                                        <Input
                                            id="repair-cost"
                                            name="repair_cost"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={repair_cost ?? ""}
                                            onChange={(event) => {
                                                if (!event.target.value) {
                                                    setRepairCost(0);
                                                    return;
                                                }
                                                setRepairCost(Number(event.target.value));
                                            }}
                                            aria-invalid={Boolean(
                                                fieldError(state.errors, "repair_cost"),
                                            )}
                                        />
                                    </div>
                                    {fieldError(state.errors, "repair_cost") ? (
                                        <p className="text-xs text-red-600">
                                            {fieldError(state.errors, "repair_cost")}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="parts-cost">Parts Cost</Label>
                                    <div className="flex items-center gap-2">
                                        <PhilippinePeso className="size-4 text-gray-400 dark:text-gray-500" />
                                        <Input
                                            id="parts-cost"
                                            name="parts_cost"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={parts_cost ?? ""}
                                            onChange={(event) => {
                                                if (!event.target.value) {
                                                    setPartsCost(0);
                                                    return;
                                                }
                                                setPartsCost(Number(event.target.value));
                                            }}
                                            aria-invalid={Boolean(
                                                fieldError(state.errors, "parts_cost"),
                                            )}
                                        />
                                    </div>
                                    {fieldError(state.errors, "parts_cost") ? (
                                        <p className="text-xs text-red-600">
                                            {fieldError(state.errors, "parts_cost")}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="total">Total</Label>
                                    <div className="flex items-center gap-2">
                                        <PhilippinePeso className="size-4 text-gray-400 dark:text-gray-500" />
                                        <Input
                                            id="total"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={String(computedTotal)}
                                            disabled
                                        />
                                    </div>
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

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold pb-4 border-b border-slate-200 dark:border-slate-700">
                                Timeline
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="space-y-2">
                                    <Label className="text-gray-600 dark:text-gray-400">
                                        Created
                                    </Label>
                                    <Input
                                        value={format(new Date(created_at), 'MMM d, yyyy, h:mm a')}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-600 dark:text-gray-400">
                                        Last Updated
                                    </Label>
                                    <Input
                                        value={format(new Date(updated_at), 'MMM d, yyyy, h:mm a')}
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