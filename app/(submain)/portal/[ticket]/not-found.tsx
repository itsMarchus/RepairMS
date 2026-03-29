import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/app/components/reusable/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/components/reusable/card";

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
            <Card className="w-full max-w-lg border-blue-300 dark:border-blue-700/70 shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <SearchX className="size-6 text-blue-700 dark:text-blue-300" />
                    </div>
                    <CardTitle className="text-2xl">Tracking Ticket Not Found</CardTitle>
                    <CardDescription>
                        We could not find a portal record for that ticket number.
                        Please check your ticket number and try again.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-center gap-3 pb-6">
                    <Button asChild>
                        <Link href="/login">Try Another Ticket</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/">Go to Homepage</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
