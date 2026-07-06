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
    /** When known, renders an uploader row (avatar, name, timeLabel) instead of just
     * showing timeLabel on its own - omit for previews of the viewer's own uploads,
     * where naming them as the uploader would be redundant. */
    uploader?: UploaderSummary;
}

/**
 * A compact "shelf" card for a resource preview - file icon, bookmark toggle, title,
 * subject + type, and (when known) who shared it and when. Used anywhere a small taste
 * of a resource list is shown (dashboard's Jump Back In, the library hub's bookmarked/
 * uploaded previews) instead of each place hand-rolling its own row.
 *
 * The whole card is one click target (a stretched overlay link), except the bookmark
 * button and the uploader's own link, which sit above it (relative + z-10) so they
 * keep working independently instead of triggering the card's navigation.
 */
const ResourcePreviewTile = ({ resourceId, title, subjectCode, typeLabel, timeLabel, uploader }: ResourcePreviewTileProps) => (
    <div className="group/card relative flex flex-col gap-3 border rounded-xl p-4 transition-all duration-150 hover:border-accent hover:-translate-y-0.5 hover:shadow-md">
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
            <p className="text-xs text-foreground-secondary mt-1">
                {subjectCode ? `${subjectCode} · ` : ""}{typeLabel}
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
