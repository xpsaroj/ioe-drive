import Link from "next/link";
import { ImageOff } from "lucide-react";

import Badge from "@/components/ui/Badge";
import { UploaderInfo } from "@/components/common/user";
import { getRelativeTime } from "@/utils/time";
import type { ConversationSummary } from "@/types/api";
import { MarketplaceListingStatus, MarketplaceListingStatusLabel } from "@/types/entities";

interface ConversationListProps {
    conversations: ConversationSummary[];
    /** So each row can show the other participant, not the viewer themself. */
    currentUserId: number;
}

const ConversationRow = ({ conversation, currentUserId }: { conversation: ConversationSummary; currentUserId: number }) => {
    const { listing, lastMessage, unreadCount } = conversation;
    const otherParty = conversation.posterId === currentUserId ? conversation.initiator : conversation.poster;
    const coverPhoto = listing.photos[0];

    return (
        <Link
            href={`/messages/${conversation.id}`}
            className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-accent hover:bg-background-hover"
        >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-background-tertiary">
                {coverPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coverPhoto.photoUrl} alt={listing.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="size-5 text-foreground-tertiary" />
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-foreground">{listing.title}</p>
                    {listing.status !== MarketplaceListingStatus.ACTIVE && (
                        <Badge size="sm" variant="secondary" className="shrink-0">
                            {MarketplaceListingStatusLabel[listing.status]}
                        </Badge>
                    )}
                </div>
                <div className="mt-1 flex items-center gap-2">
                    {/* This row is itself a <Link> to the conversation - HTML forbids nesting
                    <a> inside <a>, so the other party's name here can't also be a profile link. */}
                    <UploaderInfo user={otherParty} disableLink />
                </div>
                {lastMessage && (
                    <p className="mt-1 truncate text-sm text-foreground-secondary">{lastMessage.body}</p>
                )}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="text-xs text-foreground-tertiary">
                    {getRelativeTime(conversation.updatedAt)}
                </span>
                {unreadCount > 0 && (
                    <span className="flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
                        {unreadCount}
                    </span>
                )}
            </div>
        </Link>
    );
};

const ConversationList = ({ conversations, currentUserId }: ConversationListProps) => {
    return (
        <div className="flex flex-col gap-3">
            {conversations.map((conversation) => (
                <ConversationRow key={conversation.id} conversation={conversation} currentUserId={currentUserId} />
            ))}
        </div>
    );
};

export default ConversationList;
