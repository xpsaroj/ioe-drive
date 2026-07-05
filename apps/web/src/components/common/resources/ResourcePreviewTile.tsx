import Link from "next/link";
import { File } from "lucide-react";

interface ResourcePreviewTileProps {
    resourceId: number;
    title: string;
    subjectCode?: string;
    typeLabel: string;
    timeLabel: string;
}

/**
 * A compact "shelf" card for a resource preview - icon, relative time, title, subject
 * + type. Used anywhere a small taste of a resource list is shown (dashboard's
 * Recently Accessed, the library hub's bookmarked/uploaded previews) instead of each
 * place hand-rolling its own plain-text row.
 */
const ResourcePreviewTile = ({ resourceId, title, subjectCode, typeLabel, timeLabel }: ResourcePreviewTileProps) => (
    <Link
        href={`/resources/r/${resourceId}`}
        className="group flex flex-col gap-3 border rounded-xl p-4 transition-all duration-150 hover:border-accent hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
        <div className="flex items-center justify-between">
            <div className="size-9 rounded-md bg-background-tertiary flex items-center justify-center">
                <File className="size-4 text-foreground-secondary" />
            </div>
            <span className="font-display text-[10px] uppercase tracking-wide text-foreground-tertiary">
                {timeLabel}
            </span>
        </div>

        <div>
            <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:underline underline-offset-2">
                {title}
            </p>
            <p className="text-xs text-foreground-secondary mt-1">
                {subjectCode ? `${subjectCode} · ` : ""}{typeLabel}
            </p>
        </div>
    </Link>
);

export default ResourcePreviewTile;
