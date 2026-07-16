"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Loader from "@/components/ui/Loader";
import { useConversationMessages, useMarkConversationRead } from "@/hooks/queries/use-messaging";
import { useMarketplaceSocket } from "@/hooks/use-marketplace-socket";
import { cn } from "@/utils/cn";
import type { MessageSummary } from "@/types/api";

interface ConversationThreadProps {
    conversationId: number;
    currentUserId: number;
}

// Real-time chat is socket-only in v1 (see MessagingModule plan) - messages live in local state
// seeded from the initial fetch, then appended to directly as new_message events arrive, rather
// than fighting TanStack Query cache invalidation timing for a fast-moving list.
const ConversationThread = ({ conversationId, currentUserId }: ConversationThreadProps) => {
    const socket = useMarketplaceSocket();
    const { data, isPending, error } = useConversationMessages(conversationId);
    const { mutate: markRead } = useMarkConversationRead(conversationId);

    const [messages, setMessages] = useState<MessageSummary[]>([]);
    const [draft, setDraft] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    // Newest-first from the API - reverse to display oldest-first, like any chat thread.
    useEffect(() => {
        if (data) setMessages([...data.items].reverse());
    }, [data]);

    useEffect(() => {
        markRead();
        // Only on mount/conversation change - mutate's identity isn't stable input here.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationId]);

    useEffect(() => {
        if (!socket) return;

        socket.emit("join_conversation", { conversationId });

        const handleNewMessage = (message: MessageSummary) => {
            if (message.conversationId !== conversationId) return;
            setMessages((prev) => [...prev, message]);
            if (message.senderId !== currentUserId) markRead();
        };

        const handleError = (payload: { message?: string }) => {
            toast.error(payload?.message || "A messaging error occurred.");
        };

        socket.on("new_message", handleNewMessage);
        socket.on("error", handleError);

        return () => {
            socket.emit("leave_conversation", { conversationId });
            socket.off("new_message", handleNewMessage);
            socket.off("error", handleError);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, conversationId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    const handleSend = () => {
        const body = draft.trim();
        if (!body) return;

        if (!socket?.connected) {
            toast.error("Not connected. Please wait and try again.");
            return;
        }

        socket.emit("send_message", { conversationId, body });
        setDraft("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (isPending) {
        return (
            <div className="flex flex-1 items-center justify-center py-16">
                <Loader text="Loading messages. Please wait." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-1 items-center justify-center py-16">
                <p className="text-error text-sm">Failed to load messages. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-border p-4">
                {messages.length === 0 ? (
                    <p className="text-center text-sm text-foreground-tertiary py-8">No messages yet. Say hello!</p>
                ) : (
                    messages.map((message) => {
                        const isOwn = message.senderId === currentUserId;
                        return (
                            <div key={message.id} className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
                                <div
                                    className={cn(
                                        "max-w-[75%] rounded-xl px-3.5 py-2 text-sm",
                                        isOwn ? "bg-accent text-accent-foreground" : "bg-background-tertiary text-foreground",
                                    )}
                                >
                                    <p className="whitespace-pre-wrap break-words">{message.body}</p>
                                    <p className={cn("mt-1 text-[10px]", isOwn ? "text-accent-foreground/70" : "text-foreground-tertiary")}>
                                        {new Date(message.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            <div className="flex items-end gap-2">
                <Textarea
                    placeholder="Type a message..."
                    rows={2}
                    maxLength={2000}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                />
                <Button
                    icon={<Send className="size-4" />}
                    iconOnly
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    aria-label="Send message"
                />
            </div>
        </div>
    );
};

export default ConversationThread;
