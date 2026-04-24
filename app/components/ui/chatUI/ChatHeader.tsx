import Link from "next/link";
import { ArrowLeft, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/app/components/reusable/button";

interface ChatHeaderProps {
    ticketNumber: string;
    ticketSummary?: string;
    onReset?: () => void;
    canReset?: boolean;
}

export default function ChatHeader({
    ticketNumber,
    ticketSummary,
    onReset,
    canReset = false,
}: ChatHeaderProps) {
    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <Link href={`/ticket/${ticketNumber}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-blue-50 dark:hover:bg-slate-800"
                            >
                                <ArrowLeft className="size-4 md:mr-2" />
                                <span className="hidden md:inline">Back</span>
                            </Button>
                        </Link>
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 sm:flex">
                                <Sparkles className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="truncate bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-xl font-bold text-transparent dark:from-white dark:to-slate-300 sm:text-2xl">
                                    AI Assistant
                                </h1>
                                <p className="truncate text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                                    {ticketSummary
                                        ? ticketSummary
                                        : `Ticket ${ticketNumber}`}
                                </p>
                            </div>
                        </div>
                    </div>
                    {onReset ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onReset}
                            disabled={!canReset}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <RotateCcw className="size-4 md:mr-2" />
                            <span className="hidden md:inline">New chat</span>
                        </Button>
                    ) : null}
                </div>
            </div>
        </header>
    );
}
