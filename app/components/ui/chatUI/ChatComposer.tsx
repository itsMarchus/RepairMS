"use client";

import { useEffect, useRef } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/app/components/reusable/button";
import { Textarea } from "@/app/components/reusable/textarea";

interface ChatComposerProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onStop?: () => void;
    isStreaming: boolean;
    disabled?: boolean;
    placeholder?: string;
}

export default function ChatComposer({
    value,
    onChange,
    onSubmit,
    onStop,
    isStreaming,
    disabled = false,
    placeholder = "Ask the AI about this ticket...",
}: ChatComposerProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        const next = Math.min(textarea.scrollHeight, 200);
        textarea.style.height = `${next}px`;
    }, [value]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (!isStreaming && value.trim().length > 0 && !disabled) {
                onSubmit();
            }
        }
    };

    const canSend = !isStreaming && value.trim().length > 0 && !disabled;

    return (
        <footer className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900">
                    <Textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        rows={1}
                        disabled={disabled}
                        className="min-h-0 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
                    />
                    {isStreaming ? (
                        <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={onStop}
                            className="shrink-0 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950/40"
                            aria-label="Stop generating"
                        >
                            <Square className="size-4 fill-current" />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            size="icon"
                            onClick={() => {
                                if (canSend) onSubmit();
                            }}
                            disabled={!canSend}
                            className="shrink-0 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none dark:disabled:from-slate-700 dark:disabled:to-slate-800"
                            aria-label="Send message"
                        >
                            <Send className="size-4" />
                        </Button>
                    )}
                </div>
                <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                    AI can make mistakes. Verify diagnosis before acting.{" "}
                    <kbd className="rounded border border-slate-300 bg-slate-100 px-1 py-0.5 text-[10px] font-medium dark:border-slate-600 dark:bg-slate-800">
                        Enter
                    </kbd>{" "}
                    to send,{" "}
                    <kbd className="rounded border border-slate-300 bg-slate-100 px-1 py-0.5 text-[10px] font-medium dark:border-slate-600 dark:bg-slate-800">
                        Shift+Enter
                    </kbd>{" "}
                    for newline.
                </p>
            </div>
        </footer>
    );
}
