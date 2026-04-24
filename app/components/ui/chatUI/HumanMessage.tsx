import { User } from "lucide-react";
import { cn } from "@/app/utils/utils";

interface HumanMessageProps {
    content: string;
    className?: string;
}

export default function HumanMessage({ content, className }: HumanMessageProps) {
    return (
        <div
            className={cn(
                "flex items-start justify-end gap-3",
                className,
            )}
        >
            <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-md bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-white shadow-md shadow-blue-500/20">
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {content}
                </p>
            </div>
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <User className="size-4" />
            </div>
        </div>
    );
}
