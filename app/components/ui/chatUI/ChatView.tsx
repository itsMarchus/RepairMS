"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatComposer from "./ChatComposer";
import type { ChatMessage, ChatThreadSummary } from "./types";

interface ChatViewProps {
    ticketNumber: string;
    ticketSummary?: string;
    initialThreadId: string | null;
    initialMessages: ChatMessage[];
    recentThreads: ChatThreadSummary[];
}

const makeId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export default function ChatView({
    ticketNumber,
    ticketSummary,
    initialThreadId,
    initialMessages,
    recentThreads,
}: ChatViewProps) {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [activeThreadId, setActiveThreadId] = useState<string | null>(initialThreadId);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [isAwaitingFirstToken, setIsAwaitingFirstToken] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const appendTokenToAssistant = useCallback((assistantId: string, token: string) => {
        setMessages((prev) =>
            prev.map((message) =>
                message.id === assistantId
                    ? { ...message, content: message.content + token }
                    : message,
            ),
        );
    }, []);

    const finalizeAssistant = useCallback(
        (assistantId: string, status: "done" | "error") => {
            setMessages((prev) =>
                prev.map((message) =>
                    message.id === assistantId ? { ...message, status } : message,
                ),
            );
        },
        [],
    );

    const sendMessage = useCallback(
        async (text: string) => {
            const trimmed = text.trim();
            if (trimmed.length === 0 || isStreaming) {
                return;
            }

            const userMessage: ChatMessage = {
                id: makeId(),
                role: "user",
                content: trimmed,
                createdAt: Date.now(),
                status: "done",
            };
            const assistantMessage: ChatMessage = {
                id: makeId(),
                role: "assistant",
                content: "",
                createdAt: Date.now(),
                status: "streaming",
            };

            setMessages((prev) => [...prev, userMessage, assistantMessage]);
            setInput("");
            setIsStreaming(true);
            setIsAwaitingFirstToken(true);

            const controller = new AbortController();
            abortControllerRef.current = controller;

            try {
                const response = await fetch(
                    `/api/ai/chat/${encodeURIComponent(ticketNumber)}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            threadId: activeThreadId,
                            message: trimmed,
                        }),
                        signal: controller.signal,
                    },
                );

                if (!response.ok || !response.body) {
                    throw new Error(
                        `Request failed with status ${response.status}`,
                    );
                }

                // Server is the source of truth for thread identity. Sync
                // the URL + local state if a brand-new thread was just created.
                //
                // IMPORTANT: use `window.history.replaceState` instead of
                // `router.replace` here. We are still mid-stream, so calling
                // `router.replace` would trigger an RSC re-fetch of the page,
                // which would (a) re-render the parent with a new
                // `<ChatView key={<uuid>} />` and unmount this component,
                // killing the in-flight fetch reader, and (b) re-hydrate from
                // the DB while the assistant message hasn't been persisted
                // yet — making the streaming bubble disappear.
                // `history.replaceState` updates the URL silently; the
                // `router.refresh()` in the success path below re-syncs
                // server data once the assistant message is safely in the DB.
                const resolvedThreadId = response.headers.get("X-Thread-Id");
                if (resolvedThreadId && resolvedThreadId !== activeThreadId) {
                    setActiveThreadId(resolvedThreadId);
                    if (typeof window !== "undefined") {
                        window.history.replaceState(
                            null,
                            "",
                            `/ticket/${encodeURIComponent(ticketNumber)}/chat?thread=${encodeURIComponent(resolvedThreadId)}`,
                        );
                    }
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let receivedAny = false;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }
                    const chunk = decoder.decode(value, { stream: true });
                    if (chunk.length > 0) {
                        if (!receivedAny) {
                            receivedAny = true;
                            setIsAwaitingFirstToken(false);
                        }
                        appendTokenToAssistant(assistantMessage.id, chunk);
                    }
                }

                const tail = decoder.decode();
                if (tail.length > 0) {
                    appendTokenToAssistant(assistantMessage.id, tail);
                }

                finalizeAssistant(assistantMessage.id, "done");
                router.refresh();
            } catch (error) {
                const isAbort =
                    error instanceof DOMException && error.name === "AbortError";
                if (isAbort) {
                    finalizeAssistant(assistantMessage.id, "done");
                } else {
                    console.error("Chat stream failed:", error);
                    setMessages((prev) =>
                        prev.map((message) =>
                            message.id === assistantMessage.id
                                ? {
                                    ...message,
                                    content:
                                        message.content.length > 0
                                            ? message.content
                                            : "Sorry, something went wrong while contacting the AI. Please try again.",
                                    status: "error",
                                }
                                : message,
                        ),
                    );
                    toast.error("Failed to get a response from the AI.");
                }
            } finally {
                setIsStreaming(false);
                setIsAwaitingFirstToken(false);
                abortControllerRef.current = null;
            }
        },
        [
            activeThreadId,
            appendTokenToAssistant,
            finalizeAssistant,
            isStreaming,
            router,
            ticketNumber,
        ],
    );

    const handleSubmit = useCallback(() => {
        void sendMessage(input);
    }, [input, sendMessage]);

    const handleStop = useCallback(() => {
        abortControllerRef.current?.abort();
    }, []);

    const handleSuggestionSelect = useCallback(
        (prompt: string) => {
            void sendMessage(prompt);
        },
        [sendMessage],
    );

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <ChatHeader
                ticketNumber={ticketNumber}
                ticketSummary={ticketSummary}
                recentThreads={recentThreads}
                activeThreadId={activeThreadId}
                isStreaming={isStreaming}
            />
            <div className="flex flex-1 flex-col">
                <ChatMessageList
                    messages={messages}
                    isAwaitingFirstToken={isAwaitingFirstToken}
                    ticketNumber={ticketNumber}
                    onSuggestionSelect={handleSuggestionSelect}
                />
                <ChatComposer
                    value={input}
                    onChange={setInput}
                    onSubmit={handleSubmit}
                    onStop={handleStop}
                    isStreaming={isStreaming}
                />
            </div>
        </div>
    );
}
