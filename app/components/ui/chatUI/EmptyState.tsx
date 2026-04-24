"use client";

import { Sparkles, Wrench, Search, Package, ClipboardList } from "lucide-react";

const DEFAULT_SUGGESTIONS: Array<{ label: string; prompt: string; icon: React.ComponentType<{ className?: string }> }> = [
    {
        label: "Help me diagnose this device",
        prompt: "Help me diagnose the device on this ticket. What are the most likely causes based on the issue description?",
        icon: Search,
    },
    {
        label: "Suggest troubleshooting steps",
        prompt: "Give me a step-by-step troubleshooting plan a technician can follow on the shop floor.",
        icon: Wrench,
    },
    {
        label: "What parts might I need?",
        prompt: "Based on the reported issue, what replacement parts or tools should I prepare?",
        icon: Package,
    },
    {
        label: "Draft a technician note",
        prompt: "Draft a concise technician note summarizing the initial diagnosis and next steps.",
        icon: ClipboardList,
    },
];

interface EmptyStateProps {
    ticketNumber?: string;
    onSuggestionSelect?: (prompt: string) => void;
}

export default function EmptyState({ ticketNumber, onSuggestionSelect }: EmptyStateProps) {
    return (
        <div className="flex min-h-full flex-col items-center justify-center px-4 py-10 text-center">
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                <Sparkles className="size-7" />
            </div>
            <h2 className="mb-2 text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                AI Diagnosis Assistant
            </h2>
            <p className="mb-8 max-w-md text-sm text-slate-600 dark:text-slate-400">
                {ticketNumber
                    ? `Ask me anything about ticket ${ticketNumber}. I can help you diagnose issues, plan repairs, and draft notes.`
                    : "Ask me anything about this ticket. I can help you diagnose issues, plan repairs, and draft notes."}
            </p>

            <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {DEFAULT_SUGGESTIONS.map((suggestion) => {
                    const Icon = suggestion.icon;
                    return (
                        <button
                            key={suggestion.label}
                            type="button"
                            onClick={() => onSuggestionSelect?.(suggestion.prompt)}
                            className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white/70 p-4 text-left shadow-sm backdrop-blur-sm transition-all hover:border-sky-300 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-sky-500 dark:hover:bg-slate-900"
                        >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-100 dark:bg-slate-800 dark:text-sky-400 dark:group-hover:bg-slate-700">
                                <Icon className="size-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                    {suggestion.label}
                                </p>
                                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                                    {suggestion.prompt}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
