import { Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/app/utils/utils";
import type { ChatMessageStatus } from "./types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AIMessageProps {
    content: string;
    status?: ChatMessageStatus;
    className?: string;
}

export default function AIMessage({ content, status = "done", className }: AIMessageProps) {
    const isStreaming = status === "streaming";
    const isError = status === "error";

    return (
        <div className={cn("flex items-start gap-3", className)}>
            <div
                className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-white shadow-md",
                    isError
                        ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30"
                        : "bg-gradient-to-br from-sky-500 to-blue-600 shadow-blue-500/30",
                )}
            >
                {isError ? (
                    <AlertCircle className="size-4" />
                ) : (
                    <Sparkles className="size-4" />
                )}
            </div>
            <div
                className={cn(
                    "max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-bl-md border px-4 py-3 shadow-sm",
                    isError
                        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
                        : "border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
                )}
            >
                {content.length === 0 && isStreaming ? (
                    <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <span className="size-2 animate-pulse rounded-full bg-current" />
                        <span className="text-sm">Thinking...</span>
                    </span>
                ) : (
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                        {isStreaming ? (
                            <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-slate-500 dark:bg-slate-300" />
                        ) : null}
                    </p>
                )}
            </div>
        </div>
    );
}
