"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Check, History, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/app/components/reusable/button";
import { cn } from "@/app/utils/utils";
import type { ChatThreadSummary } from "./types";

interface ThreadListProps {
    ticketNumber: string;
    threads: ChatThreadSummary[];
    activeThreadId: string | null;
}

function formatRelative(iso: string | null | undefined): string {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return formatDistanceToNow(date, { addSuffix: true });
}

export default function ThreadList({
    ticketNumber,
    threads,
    activeThreadId,
}: ThreadListProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    const handleSelectThread = (threadId: string) => {
        setIsOpen(false);
        if (threadId === activeThreadId) return;
        router.push(
            `/ticket/${encodeURIComponent(ticketNumber)}/chat?thread=${encodeURIComponent(threadId)}`,
        );
    };

    const handleNewChat = () => {
        setIsOpen(false);
        if (activeThreadId === null) return;
        router.push(`/ticket/${encodeURIComponent(ticketNumber)}/chat?new=1`);
    };

    return (
        <div ref={containerRef} className="relative">
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className="hover:bg-slate-50 dark:hover:bg-slate-800"
            >
                <History className="size-4 md:mr-2" />
                <span className="hidden md:inline">Recent chats</span>
                {threads.length > 0 ? (
                    <span className="ml-1 hidden rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 md:inline">
                        {threads.length}
                    </span>
                ) : null}
            </Button>

            {isOpen ? (
                <div
                    role="listbox"
                    aria-label="Recent chat threads"
                    className="absolute right-0 z-30 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
                >
                    <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={handleNewChat}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-sky-600 transition-colors hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-slate-800"
                        >
                            <Plus className="size-4" />
                            Start a new chat
                        </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto py-1">
                        {threads.length === 0 ? (
                            <p className="px-4 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                                No previous chats yet.
                            </p>
                        ) : (
                            threads.map((thread) => {
                                const isActive = thread.id === activeThreadId;
                                const title =
                                    thread.title?.trim().length
                                        ? thread.title
                                        : "Untitled chat";
                                return (
                                    <button
                                        key={thread.id}
                                        type="button"
                                        onClick={() => handleSelectThread(thread.id)}
                                        className={cn(
                                            "flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition-colors",
                                            isActive
                                                ? "bg-sky-50 text-sky-900 dark:bg-slate-800 dark:text-sky-200"
                                                : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800",
                                        )}
                                        aria-current={isActive ? "true" : undefined}
                                    >
                                        <MessageSquare
                                            className={cn(
                                                "mt-0.5 size-4 shrink-0",
                                                isActive
                                                    ? "text-sky-600 dark:text-sky-400"
                                                    : "text-slate-400",
                                            )}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="truncate font-medium">
                                                    {title}
                                                </p>
                                                {isActive ? (
                                                    <Check className="size-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
                                                ) : null}
                                            </div>
                                            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                                                {formatRelative(thread.updated_at)}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
