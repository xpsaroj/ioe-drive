import Link from "next/link";
import { ImageOff } from "lucide-react";

import Badge from "@/components/ui/Badge";
import { UserAvatar } from "@/components/common/user";
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
            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-background-tertiary">
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
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate font-semibold text-foreground">{listing.title}</p>
                        {listing.status !== MarketplaceListingStatus.ACTIVE && (
                            <Badge size="sm" variant="secondary" className="shrink-0">
                                {MarketplaceListingStatusLabel[listing.status]}
                            </Badge>
                        )}
                    </div>
                    <span className="shrink-0 text-xs text-foreground-tertiary">
                        {getRelativeTime(conversation.updatedAt)}
                    </span>
                </div>

                <div className="mt-1.5 flex items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-sm text-foreground-secondary">
                        {lastMessage ? lastMessage.body : "No messages yet"}
                    </p>
                    <div className="flex shrink-0 items-center gap-1.5">
                        <UserAvatar
                            fullName={otherParty?.fullName ?? ""}
                            avatarUrl={otherParty?.profile?.profilePictureUrl}
                            size="sm"
                        />
                        <span className="text-xs font-medium text-foreground-secondary">
                            {otherParty?.fullName ?? "Unknown User"}
                        </span>
                    </div>
                    {unreadCount > 0 && (
                        <span className="flex min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
                            {unreadCount}
                        </span>
                    )}
                </div>
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
