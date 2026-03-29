import Link from "next/link";
import { Wrench } from "lucide-react";
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
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
            <Card className="w-full max-w-lg border-amber-300 dark:border-amber-700/70 shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <Wrench className="size-6 text-amber-700 dark:text-amber-300" />
                    </div>
                    <CardTitle className="text-2xl">Ticket Not Found</CardTitle>
                    <CardDescription>
                        We could not find that repair ticket. It may have been removed,
                        mistyped, or is no longer accessible.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-center gap-3 pb-6">
                    <Button asChild>
                        <Link href="/">Go to Dashboard</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/queued">View Queued Tickets</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}