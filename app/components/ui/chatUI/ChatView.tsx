"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatComposer from "./ChatComposer";
import type { ChatMessage } from "./types";

interface ChatViewProps {
    ticketNumber: string;
    ticketSummary?: string;
}

const makeId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export default function ChatView({ ticketNumber, ticketSummary }: ChatViewProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
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

            const history = [...messages, userMessage].map((m) => ({
                role: m.role,
                content: m.content,
            }));

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
                        body: JSON.stringify({ messages: history }),
                        signal: controller.signal,
                    },
                );

                if (!response.ok || !response.body) {
                    throw new Error(
                        `Request failed with status ${response.status}`,
                    );
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
        [appendTokenToAssistant, finalizeAssistant, isStreaming, messages, ticketNumber],
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

    const handleReset = useCallback(() => {
        if (isStreaming) {
            abortControllerRef.current?.abort();
        }
        setMessages([]);
        setInput("");
    }, [isStreaming]);

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <ChatHeader
                ticketNumber={ticketNumber}
                ticketSummary={ticketSummary}
                onReset={handleReset}
                canReset={messages.length > 0 && !isStreaming}
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
