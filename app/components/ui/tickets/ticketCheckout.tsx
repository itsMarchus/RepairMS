"use client";

import { TicketCheckoutType } from "@/app/lib/definitions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { checkoutTicket } from "@/app/utils/supabase/action";
import { Button } from "@/app/components/reusable/button";
import { Card } from "@/app/components/reusable/card";
import { Badge } from "@/app/components/reusable/badge";
import { Label } from "@/app/components/reusable/label";
import { Separator } from "@/app/components/reusable/separator";
import { ArrowLeft, CheckCircle, PhilippinePeso, Receipt } from "lucide-react";
import { toast } from "sonner";

export default function TicketCheckout({ ticket }: { ticket: TicketCheckoutType }) {
    const router = useRouter();
    const {
        id,
        ticket_number,
        customer_name,
        customer_phone,
        device_type,
        device_brand,
        device_model,
        issue_description,
        repair_cost,
        parts_cost,
        total_cost,
        paid,
    } = ticket;

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const formatPeso = (value: number) =>
        value.toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
        });

    const paymentRows = Object.entries({ repair_cost, parts_cost }).filter(
        ([_, value]) => typeof value === "number",
    );
    const checkoutTotal = typeof total_cost === "number"
        ? total_cost
        : paymentRows.reduce((sum, [_, value]) => sum + value, 0);

    const handleCheckoutToggle = async () => {
        if (isCheckingOut) {
            return;
        }

        setIsCheckingOut(true);
        const nextPaidState = !paid;
        const result = await checkoutTicket(id, nextPaidState);

        if (!result.success) {
            toast.error(result.message ?? "Failed to update checkout status.");
            setIsCheckingOut(false);
            return;
        }

        toast.success(
            nextPaidState
                ? "Checkout completed successfully."
                : "Checkout marked as incomplete.",
        );
        router.replace(`/ticket/${ticket_number}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-5">
                    <div className="flex items-center gap-4">
                        <Link href={`/ticket/${ticket_number}`}>
                            <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                                <ArrowLeft className="size-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Checkout
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{ticket_number}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-6">
                        <Card className="p-6 shadow-lg border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Receipt className="size-5 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    Repair Summary
                                </h2>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-gray-600 dark:text-gray-400">Customer</Label>
                                    <p className="font-medium">{customer_name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{customer_phone}</p>
                                </div>
                                <Separator />
                                <div>
                                    <Label className="text-gray-600 dark:text-gray-400">Device</Label>
                                    <p className="font-medium">
                                        {device_brand} {device_model}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{device_type}</p>
                                </div>
                                <Separator />
                                <div>
                                    <Label className="text-gray-600 dark:text-gray-400">Issue</Label>
                                    <p className="text-sm">{issue_description}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 shadow-lg border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <PhilippinePeso className="size-5 text-green-600" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Payment</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                                    {paymentRows.map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex justify-between items-center mb-2"
                                        >
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {key === "repair_cost"
                                                    ? "Repair Cost"
                                                    : "Parts Cost"}
                                            </span>
                                            <span className="font-semibold">
                                                {formatPeso(value)}
                                            </span>
                                        </div>
                                    ))}
                                    <Separator className="my-2" />
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="font-semibold">Total</span>
                                        <span className="font-bold">
                                            {formatPeso(checkoutTotal)}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Badge
                                        variant={paid ? "default" : "secondary"}
                                        className="w-full justify-center text-base py-2"
                                    >
                                        {paid ? (
                                            <>
                                                <CheckCircle className="size-4 mr-2" />
                                                Paid
                                            </>
                                        ) : (
                                            "Unpaid"
                                        )}
                                    </Badge>
                                </div>

                                <Button
                                    type="button"
                                    className="w-full h-12 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
                                    onClick={handleCheckoutToggle}
                                    disabled={isCheckingOut}
                                >
                                    <Receipt className="size-4 mr-2" />
                                    {isCheckingOut
                                        ? "Updating..."
                                        : paid
                                            ? "Mark Checkout Incomplete"
                                            : "Complete Checkout"}
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}