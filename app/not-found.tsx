import Link from "next/link";
import { Compass } from "lucide-react";
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
        <main className="min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <Compass className="size-6 text-slate-700 dark:text-slate-200" />
                    </div>
                    <CardTitle className="text-2xl">Page Not Found</CardTitle>
                    <CardDescription>
                        The page you are looking for does not exist or may have
                        been moved.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-center gap-3 pb-6">
                    <Button asChild>
                        <Link href="/">Go to Dashboard</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/new-ticket">Create New Ticket</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}