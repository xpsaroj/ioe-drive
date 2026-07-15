import Link from "next/link";
import { File } from "lucide-react";

import BookmarkButton from "./BookmarkButton";
import { UploaderInfo } from "@/components/common/user";
import type { UploaderSummary } from "@/types/api";

interface ResourcePreviewTileProps {
    resourceId: number;
    title: string;
    subjectCode?: string;
    typeLabel: string;
    timeLabel: string;
    /** Omit for previews of the viewer's own uploads, where naming the uploader is redundant. */
    uploader?: UploaderSummary;
}

// Whole card is one stretched-link click target; bookmark button and uploader link sit above it (z-10) to stay independently clickable.
const ResourcePreviewTile = ({ resourceId, title, subjectCode, typeLabel, timeLabel, uploader }: ResourcePreviewTileProps) => (
    <div className="group/card relative flex flex-col gap-3 border border-border bg-card-background rounded-xl p-4 transition-all duration-150 hover:border-accent hover:bg-card-hover hover:-translate-y-0.5 hover:shadow-md">
        <Link
            href={`/resources/r/${resourceId}`}
            aria-label={title}
            className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />

        <div className="flex items-center justify-between">
            <span className="size-9 rounded-md bg-background-tertiary flex items-center justify-center">
                <File className="size-4 text-foreground-secondary" />
            </span>
            <span className="relative z-10">
                <BookmarkButton resourceId={resourceId} />
            </span>
        </div>

        <div>
            <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover/card:underline underline-offset-2">
                {title}
            </p>
            <p className="text-xs text-foreground-secondary mt-1 flex items-center gap-2">
                {subjectCode && <span>{subjectCode}</span>}
                <span>{typeLabel}</span>
            </p>
        </div>

        {uploader ? (
            <div className="relative z-10">
                <UploaderInfo user={uploader} subtitle={timeLabel} />
            </div>
        ) : (
            <span className="font-display text-[10px] uppercase tracking-wide text-foreground-tertiary">
                {timeLabel}
            </span>
        )}
    </div>
);

export default ResourcePreviewTile;
