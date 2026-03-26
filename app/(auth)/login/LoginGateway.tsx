"use client";

import { Button } from "@/app/components/reusable/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/reusable/card";
import { Input } from "@/app/components/reusable/input";
import { Label } from "@/app/components/reusable/label";
import { ArrowLeft, LogIn, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { loginWithPassword } from "@/app/(auth)/login/actions";

type GatewayMode = "main" | "login" | "track";

interface LoginGatewayProps {
    nextPath: string;
    error?: string;
}

export default function LoginGateway({ nextPath, error }: LoginGatewayProps) {
    const router = useRouter();
    const [mode, setMode] = useState<GatewayMode>("main");
    const [ticketNumber, setTicketNumber] = useState("");
    const [ticketError, setTicketError] = useState<string | null>(null);

    const normalizedTicket = useMemo(
        () => ticketNumber.trim().toLowerCase(),
        [ticketNumber],
    );

    const handleTrackTicket = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!normalizedTicket) {
            setTicketError("Please enter your ticket number.");
            return;
        }

        setTicketError(null);
        router.push(`/portal/${normalizedTicket}`);
    };

    if (mode === "main") {
        return (
            <Card className="w-full max-w-md border-slate-200/80 bg-white/85 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <CardHeader className="space-y-2">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                        <LogIn className="size-5" />
                    </div>
                    <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Welcome to ToyexFix
                    </CardTitle>
                    <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                        Continue to dashboard or track ticket.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {error ? (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
                            {error}
                        </p>
                    ) : null}
                    <Button
                        onClick={() => setMode("login")}
                        className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
                    >
                        <LogIn className="size-4" />
                        Sign in
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setMode("track")}
                    >
                        <Search className="size-4" />
                        Track ticket
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (mode === "login") {
        return (
            <Card className="w-full max-w-md border-slate-200/80 bg-white/85 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <CardHeader className="space-y-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-fit"
                        onClick={() => setMode("main")}
                    >
                        <ArrowLeft className="size-4 mr-2" />
                        Back
                    </Button>
                    <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Sign in to ToyexFix
                    </CardTitle>
                    <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                        Continue to your repair dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error ? (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
                            {error}
                        </p>
                    ) : null}

                    <form action={loginWithPassword} className="space-y-4">
                        <input type="hidden" name="next" value={nextPath} />
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@company.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
                        >
                            <LogIn className="size-4" />
                            Sign in with password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md border-slate-200/80 bg-white/85 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <CardHeader className="space-y-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-fit"
                    onClick={() => setMode("main")}
                >
                    <ArrowLeft className="size-4 mr-2" />
                    Back
                </Button>
                <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Track ticket
                </CardTitle>
                <CardDescription className="text-center text-slate-600 dark:text-slate-400">
                    Enter your ticket number to check your repair status.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleTrackTicket} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ticket-number">Ticket Number</Label>
                        <Input
                            id="ticket-number"
                            value={ticketNumber}
                            onChange={(event) => setTicketNumber(event.target.value)}
                            placeholder="e.g. tkp000123"
                            required
                        />
                        {ticketError ? (
                            <p className="text-sm text-red-600">{ticketError}</p>
                        ) : null}
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-500/30"
                    >
                        <Search className="size-4" />
                        Search ticket
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
