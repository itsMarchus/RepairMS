import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-blue-500/30">
                <Sparkles className="size-4" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <span className="size-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500 [animation-delay:-0.3s]" />
                <span className="size-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500 [animation-delay:-0.15s]" />
                <span className="size-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" />
            </div>
        </div>
    );
}
