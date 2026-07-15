"use client";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/ui/Button";
import { useMe, useResourceVoteValues, useSetResourceVote, useClearResourceVote } from "@/hooks/queries/use-me";

interface VoteButtonsProps {
    resourceId: number;
    upvoteCount: number;
    downvoteCount: number;
    /** Hides the buttons for the resource's own uploader - voting on your own resource isn't allowed. */
    uploadedBy?: number;
}

const VoteButtons = ({ resourceId, upvoteCount, downvoteCount, uploadedBy }: VoteButtonsProps) => {
    const { data: userData } = useMe();
    const { data: voteValues } = useResourceVoteValues();
    const { mutate: setVote, isPending: isSettingVote } = useSetResourceVote();
    const { mutate: clearVote, isPending: isClearingVote } = useClearResourceVote();

    if (!userData || userData.id === uploadedBy) return null;

    const myVote = voteValues?.[resourceId];
    const isPending = isSettingVote || isClearingVote;

    const handleVote = (value: 1 | -1) => {
        const resourceIdString = String(resourceId);
        const onError = (error: unknown) => {
            toast.error(error instanceof Error ? error.message : "Failed to record your vote.");
        };

        if (myVote === value) {
            clearVote(resourceIdString, { onError });
        } else {
            setVote({ resourceId: resourceIdString, value }, { onError });
        }
    };

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="xs"
                icon={<ArrowBigUp className="size-4" fill={myVote === 1 ? "currentColor" : "none"} />}
                onClick={() => handleVote(1)}
                disabled={isPending}
                className={myVote === 1 ? "text-success hover:text-success hover:bg-success/10" : "text-foreground-secondary hover:text-success hover:bg-success/10"}
                aria-label={myVote === 1 ? "Remove upvote" : "Upvote"}
                aria-pressed={myVote === 1}
            >
                {upvoteCount}
            </Button>
            <Button
                variant="ghost"
                size="xs"
                icon={<ArrowBigDown className="size-4" fill={myVote === -1 ? "currentColor" : "none"} />}
                onClick={() => handleVote(-1)}
                disabled={isPending}
                className={myVote === -1 ? "text-error hover:text-error hover:bg-error/10" : "text-foreground-secondary hover:text-error hover:bg-error/10"}
                aria-label={myVote === -1 ? "Remove downvote" : "Downvote"}
                aria-pressed={myVote === -1}
            >
                {downvoteCount}
            </Button>
        </div>
    );
};

export default VoteButtons;
