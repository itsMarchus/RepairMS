"use client";

import { useEffect, useRef } from "react";
import HumanMessage from "./HumanMessage";
import AIMessage from "./AIMessage";
import TypingIndicator from "./TypingIndicator";
import EmptyState from "./EmptyState";
import type { ChatMessage } from "./types";

interface ChatMessageListProps {
    messages: ChatMessage[];
    isAwaitingFirstToken: boolean;
    ticketNumber?: string;
    onSuggestionSelect?: (prompt: string) => void;
}

export default function ChatMessageList({
    messages,
    isAwaitingFirstToken,
    ticketNumber,
    onSuggestionSelect,
}: ChatMessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    const lastMessageContent = messages[messages.length - 1]?.content ?? "";
    const lastMessageStatus = messages[messages.length - 1]?.status;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages.length, lastMessageContent, lastMessageStatus, isAwaitingFirstToken]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto h-full max-w-3xl px-4 sm:px-6">
                    <EmptyState
                        ticketNumber={ticketNumber}
                        onSuggestionSelect={onSuggestionSelect}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
                <div className="space-y-5">
                    {messages.map((message) => {
                        if (message.role === "user") {
                            return (
                                <HumanMessage
                                    key={message.id}
                                    content={message.content}
                                />
                            );
                        }

                        if (message.role === "assistant") {
                            return (
                                <AIMessage
                                    key={message.id}
                                    content={message.content}
                                    status={message.status}
                                />
                            );
                        }

                        return null;
                    })}
                    {isAwaitingFirstToken ? <TypingIndicator /> : null}
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
}
