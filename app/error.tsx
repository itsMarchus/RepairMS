"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/app/components/reusable/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/components/reusable/card";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Unhandled route error:", error);
    }, [error]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <AlertTriangle className="size-6 text-red-700 dark:text-red-300" />
                    </div>
                    <CardTitle className="text-2xl">
                        Something went wrong
                    </CardTitle>
                    <CardDescription>
                        We ran into an unexpected issue while loading this page.
                        Please try again.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-center gap-3 pb-6">
                    <Button onClick={reset}>
                        <RefreshCw className="size-4 mr-2" />
                        Try again
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/">Back to Dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
