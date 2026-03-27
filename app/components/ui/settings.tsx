"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTheme } from "next-themes";
import {
    ArrowLeft,
    Laptop,
    LogOut,
    Moon,
    Palette,
    Save,
    Store,
    Sun,
    User,
} from "lucide-react";
import { toast } from "sonner";

import { signOut, saveStoreDetails } from "@/app/utils/supabase/action";
import { Button } from "@/app/components/reusable/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/components/reusable/card";
import { Input } from "@/app/components/reusable/input";
import { Label } from "@/app/components/reusable/label";

type SectionKey = "account" | "shop" | "appearance";

interface SettingsProps {
    account: {
        fullName: string;
        email: string;
        phoneNumber: string;
    };
    store: {
        id: string;
        shopName: string;
        physicalAddress: string;
        contactNumber: string;
    };
}

function SignOutButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" variant="destructive" disabled={pending}>
            <LogOut className="size-4 mr-2" />
            {pending ? "Signing out..." : "Sign out"}
        </Button>
    );
}

export default function SettingsView({ account, store }: SettingsProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionKey>("account");
    const [shopForm, setShopForm] = useState({
        id: store.id,
        shop_name: store.shopName,
        physical_address: store.physicalAddress,
        contact_number: store.contactNumber,
    });

    const [storeState, storeAction, isSavingStore] = useActionState(
        saveStoreDetails,
        {
            success: false,
            message: "",
        },
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!storeState.message) {
            return;
        }

        if (storeState.success) {
            toast.success(storeState.message);
            return;
        }

        toast.error(storeState.message);
    }, [storeState.message, storeState.success]);

    const sections = useMemo(
        () => [
            { key: "account" as const, label: "Account Details", icon: User },
            { key: "shop" as const, label: "Shop Details", icon: Store },
            {
                key: "appearance" as const,
                label: "Appearance",
                icon: Palette,
            },
        ],
        [],
    );

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <Link href="/">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-blue-50 dark:hover:bg-slate-800"
                                >
                                    <ArrowLeft className="size-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                    Settings
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Manage your account, shop details, and app
                                    preferences.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="w-full flex flex-col md:flex-row gap-6">
                    <div className="flex md:flex-col h-auto bg-transparent gap-2 md:w-64 shrink-0 overflow-auto">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.key;

                            return (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => setActiveSection(section.key)}
                                    className={`w-full min-w-fit md:min-w-0 md:justify-start px-4 py-3 rounded-xl transition-colors border text-sm font-medium flex items-center ${
                                        isActive
                                            ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-blue-400 border-slate-200 dark:border-slate-700"
                                            : "bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-white/70 dark:hover:bg-slate-900/70"
                                    }`}
                                >
                                    <Icon className="size-4 mr-3" />
                                    {section.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex-1 space-y-6">
                        {activeSection === "account" ? (
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>
                                        Your authenticated account details from
                                        Supabase Auth.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="full_name">
                                                Full Name
                                            </Label>
                                            <Input
                                                id="full_name"
                                                value={account.fullName}
                                                disabled
                                                className="bg-muted/60"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                value={account.email}
                                                type="email"
                                                disabled
                                                className="bg-muted/60"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone_number">
                                                Phone Number
                                            </Label>
                                            <Input
                                                id="phone_number"
                                                value={account.phoneNumber}
                                                disabled
                                                className="bg-muted/60"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <form action={signOut}>
                                            <SignOutButton />
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : null}

                        {activeSection === "shop" ? (
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Shop Details</CardTitle>
                                    <CardDescription>
                                        Update your store information visible to
                                        customers.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        action={storeAction}
                                        className="space-y-4"
                                    >
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={shopForm.id}
                                        />
                                        <div className="space-y-2">
                                            <Label htmlFor="shop_name">
                                                Shop Name
                                            </Label>
                                            <Input
                                                id="shop_name"
                                                name="shop_name"
                                                value={shopForm.shop_name}
                                                onChange={(event) =>
                                                    setShopForm((prev) => ({
                                                        ...prev,
                                                        shop_name:
                                                            event.target.value,
                                                    }))
                                                }
                                                disabled
                                                className="bg-muted/60"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="physical_address">
                                                Physical Address
                                            </Label>
                                            <Input
                                                id="physical_address"
                                                name="physical_address"
                                                value={
                                                    shopForm.physical_address
                                                }
                                                onChange={(event) =>
                                                    setShopForm((prev) => ({
                                                        ...prev,
                                                        physical_address:
                                                            event.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_number">
                                                Contact Number
                                            </Label>
                                            <Input
                                                id="contact_number"
                                                name="contact_number"
                                                value={shopForm.contact_number}
                                                onChange={(event) =>
                                                    setShopForm((prev) => ({
                                                        ...prev,
                                                        contact_number:
                                                            event.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={
                                                isSavingStore || !shopForm.id
                                            }
                                            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30"
                                        >
                                            <Save className="size-4 mr-2" />
                                            {isSavingStore
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </Button>
                                        {!shopForm.id ? (
                                            <p className="text-sm text-red-600">
                                                No store record found. Create
                                                one in your database first.
                                            </p>
                                        ) : null}
                                    </form>
                                </CardContent>
                            </Card>
                        ) : null}

                        {activeSection === "appearance" ? (
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Theme Preferences</CardTitle>
                                    <CardDescription>
                                        Choose how the dashboard appears for
                                        your account on this browser.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setTheme("light")}
                                            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                                                theme === "light"
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                                    : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400"
                                            }`}
                                        >
                                            <Sun className="size-8 mb-3" />
                                            <span className="font-medium text-sm">
                                                Light
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTheme("dark")}
                                            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                                                theme === "dark"
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                                    : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400"
                                            }`}
                                        >
                                            <Moon className="size-8 mb-3" />
                                            <span className="font-medium text-sm">
                                                Dark
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTheme("system")}
                                            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                                                theme === "system"
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                                    : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400"
                                            }`}
                                        >
                                            <Laptop className="size-8 mb-3" />
                                            <span className="font-medium text-sm">
                                                System
                                            </span>
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : null}
                    </div>
                </div>
            </main>
        </div>
    );
}
