"use client";

import Link from "next/link";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { Button } from "@/app/components/reusable/button";
import { Input } from "@/app/components/reusable/input";
import { Textarea } from "@/app/components/reusable/textarea";
import { Label } from "@/app/components/reusable/label";
import { Card } from "@/app/components/reusable/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/reusable/select";
import { useState } from "react";

export default function TicketAdd() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-5">
                    <div className="flex items-center gap-4">
                        <Link href="/">
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
                                New Repair Ticket
                            </h1>
                            <p className="text-sm text-slate-600">
                                Digital Device Intake
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <form>
                    <div className="space-y-6">
                        {/* Customer Information */}
                        <Card className="p-6 shadow-lg border-slate-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <svg
                                        className="size-5 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Customer Information
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="customerName">
                                        Customer Name *
                                    </Label>
                                    <Input
                                        id="customerName"
                                        // value={formData.customerName}
                                        // onChange={(e) =>
                                        //     setFormData({
                                        //         ...formData,
                                        //         customerName: e.target.value,
                                        //     })
                                        // }
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="customerPhone">
                                        Phone Number *
                                    </Label>
                                    <Input
                                        id="customerPhone"
                                        type="tel"
                                        // value={formData.customerPhone}
                                        // onChange={(e) =>
                                        //     setFormData({
                                        //         ...formData,
                                        //         customerPhone: e.target.value,
                                        //     })
                                        // }
                                        placeholder="(+63) 9XX XXX XXXX"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="customerEmail">
                                        Email (Optional)
                                    </Label>
                                    <Input
                                        id="customerEmail"
                                        type="email"
                                        // value={formData.customerEmail}
                                        // onChange={(e) =>
                                        //     setFormData({
                                        //         ...formData,
                                        //         customerEmail: e.target.value,
                                        //     })
                                        // }
                                        placeholder="customer@email.com"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Device Information */}
                        <Card className="p-6 shadow-lg border-slate-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <svg
                                        className="size-5 text-purple-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Device Information
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="deviceType">
                                        Device Type *
                                    </Label>
                                    <Select
                                        // value={formData.deviceType}
                                        // onValueChange={(value) =>
                                        //     setFormData({
                                        //         ...formData,
                                        //         deviceType: value,
                                        //     })
                                        // }
                                    >
                                        <SelectTrigger id="deviceType">
                                            <SelectValue placeholder="Select device type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Smartphone">
                                                Smartphone
                                            </SelectItem>
                                            <SelectItem value="Tablet">
                                                Tablet
                                            </SelectItem>
                                            <SelectItem value="Laptop">
                                                Laptop
                                            </SelectItem>
                                            <SelectItem value="Desktop">
                                                Desktop
                                            </SelectItem>
                                            <SelectItem value="Smartwatch">
                                                Smartwatch
                                            </SelectItem>
                                            <SelectItem value="Gaming Console">
                                                Gaming Console
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="brand">Brand *</Label>
                                    <Input
                                        id="brand"
                                        // value={formData.brand}
                                        // onChange={(e) =>
                                        //     setFormData({
                                        //         ...formData,
                                        //         brand: e.target.value,
                                        //     })
                                        // }
                                        placeholder="Apple, Samsung, Dell, etc."
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="model">Model *</Label>
                                    <Input
                                        id="model"
                                        // value={formData.model}
                                        // onChange={(e) =>
                                        //     setFormData({
                                        //         ...formData,
                                        //         model: e.target.value,
                                        //     })
                                        // }
                                        placeholder="iPhone 14 Pro, Galaxy S23, XPS 15, etc."
                                        required
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Issue Description */}
                        <Card className="p-6 shadow-lg border-slate-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <svg
                                        className="size-5 text-orange-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Issue Description
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="issueDescription">
                                        Describe the Issue *
                                    </Label>
                                    <Textarea
                                        id="issueDescription"
                                        // value={formData.issueDescription}
                                        // onChange={(e) =>
                                        //     setFormData({
                                        //         ...formData,
                                        //         issueDescription:
                                        //             e.target.value,
                                        //     })
                                        // }
                                        placeholder="Detailed description of the problem..."
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="estimatedHours">
                                        Estimated Completion (Hours)
                                    </Label>
                                    <Input
                                        id="estimatedHours"
                                        type="number"
                                        // value={formData.estimatedHours}
                                        // onChange={(e) =>
                                        //     setFormData({
                                        //         ...formData,
                                        //         estimatedHours: e.target.value,
                                        //     })
                                        // }
                                        min="1"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Before Photos */}
                        <Card className="p-6 shadow-lg border-slate-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Camera className="size-5 text-green-600" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Before Photos
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label
                                        htmlFor="photoUpload"
                                        className="cursor-pointer"
                                    >
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-sky-400 hover:bg-sky-50/50 transition-all bg-gradient-to-br from-slate-50 to-blue-50/20">
                                            <Camera className="size-12 mx-auto text-slate-400 mb-2" />
                                            <p className="text-sm font-medium text-slate-700">
                                                Click to upload device photos
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Recommended for documentation
                                            </p>
                                        </div>
                                    </Label>
                                    <Input
                                        id="photoUpload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        // onChange={handlePhotoUpload}
                                        className="hidden"
                                    />
                                </div>

                                {/* {beforePhotos.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4">
                                        {beforePhotos.map((photo, index) => (
                                            <div
                                                key={index}
                                                className="relative"
                                            >
                                                <img
                                                    src={photo}
                                                    alt={`Before ${index + 1}`}
                                                    className="rounded-lg w-full h-32 object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() =>
                                                        setBeforePhotos(
                                                            (prev) =>
                                                                prev.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        index,
                                                                ),
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )} */}
                            </div>
                        </Card>

                        {/* Submit */}
                        <div className="flex gap-3 justify-end">
                            <Link href="/">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="hover:bg-slate-50"
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 px-8"
                            >
                                <Save className="size-4 mr-2" />
                                Create Ticket
                            </Button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
