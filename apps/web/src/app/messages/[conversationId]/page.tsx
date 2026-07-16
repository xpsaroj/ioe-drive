"use client"
import { use } from "react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ImageOff } from "lucide-react";

import { useConversation } from "@/hooks/queries/use-messaging";
import { useMe } from "@/hooks/queries/use-me";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { PageStateHandler } from "@/components/layout";
import { ConversationThread } from "@/components/common/messaging";
import { UploaderInfo } from "@/components/common/user";
import { MarketplaceListingStatus, MarketplaceListingStatusLabel } from "@/types/entities";

interface ConversationThreadPageProps {
    params: Promise<{
        conversationId: string;
    }>
}

const ConversationThreadPage = ({
    params
}: ConversationThreadPageProps) => {
    const { conversationId: cId } = use(params);
    const conversationId = Number(cId);

    const router = useRouter();

    const { data: conversation, isPending, error } = useConversation(conversationId);
    const { data: userData, isPending: userPending } = useMe();

    const backButton = (
        <Button
            icon={<ChevronLeft className="size-4" />}
            iconOnly
            variant="ghost"
            size="xs"
            className="border border-border shrink-0"
            onClick={() => router.push("/messages")}
            aria-label="Back to messages"
        />
    );

    const isMissing = !conversationId || isNaN(conversationId) || !conversation;

    if (isMissing || isPending || userPending) {
        return (
            <PageStateHandler
                isPending={isPending || userPending}
                error={error}
                isEmpty={!isPending && !userPending && isMissing}
                header={
                    <div className="flex items-center gap-2 mb-4">
                        {backButton}
                        <h3 className="text-xl md:text-2xl font-medium">Conversation</h3>
                    </div>
                }
                loaderText="Loading conversation. Please wait."
                emptyContent={
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-4xl">404</p>
                        <p className="text-foreground-secondary">This conversation does not exist.</p>
                    </div>
                }
                stateContainerClassName="flex-1 flex items-center justify-center border rounded-lg min-h-[50vh]"
            >
                {null}
            </PageStateHandler>
        );
    }

    const otherParty = conversation.posterId === userData?.id ? conversation.initiator : conversation.poster;
    const coverPhoto = conversation.listing.photos[0];

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground md:p-8 p-6 max-w-4xl mx-auto space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                {backButton}

                <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-background-tertiary">
                    {coverPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={coverPhoto.photoUrl} alt={conversation.listing.title} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <ImageOff className="size-4 text-foreground-tertiary" />
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/market/${conversation.listing.id}`}
                            className="truncate font-semibold text-foreground hover:underline"
                        >
                            {conversation.listing.title}
                        </Link>
                        {conversation.listing.status !== MarketplaceListingStatus.ACTIVE && (
                            <Badge size="sm" variant="secondary" className="shrink-0">
                                {MarketplaceListingStatusLabel[conversation.listing.status]}
                            </Badge>
                        )}
                    </div>
                    <UploaderInfo user={otherParty} />
                </div>
            </div>

            {userData && <ConversationThread conversationId={conversationId} currentUserId={userData.id} />}
        </div>
    )
}

export default ConversationThreadPage;
