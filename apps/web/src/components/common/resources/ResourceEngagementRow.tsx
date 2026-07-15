"use client";
import { Download } from "lucide-react";

import VoteButtons from "./VoteButtons";
import { useMe } from "@/hooks/queries/use-me";

interface ResourceEngagementRowProps {
    resourceId: number;
    upvoteCount: number;
    downvoteCount: number;
    downloadCount: number;
    uploadedBy?: number;
    className?: string;
}

const ResourceEngagementRow = ({ resourceId, upvoteCount, downvoteCount, downloadCount, uploadedBy, className = "" }: ResourceEngagementRowProps) => {
    const { data: userData } = useMe();
    const canVote = !!userData && userData.id !== uploadedBy;

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {canVote && (
                <VoteButtons resourceId={resourceId} upvoteCount={upvoteCount} downvoteCount={downvoteCount} uploadedBy={uploadedBy} />
            )}

            <span className="ms-auto flex items-center gap-1 shrink-0 text-xs text-foreground-tertiary" title={`${downloadCount} download${downloadCount === 1 ? "" : "s"}`}>
                <Download className="size-3.5" />
                {downloadCount}
            </span>
        </div>
    );
};

export default ResourceEngagementRow;
