"use client";
import Link from "next/link";
import { ArrowUpRight, File } from "lucide-react";

import StatStrip from "@/components/ui/StatStrip";
import { ResourcePreviewTile } from "@/components/common/resources";
import { useRecentResources, useBookmarkedResources, useUploadedResources } from "@/hooks/queries/use-me";
import { getRelativeTime } from "@/utils/time";
import { ResourceTypeLabel } from "@/types/entities";
import type { RecentResourceItem } from "@/types/api";

const ContinueCard = ({ latest }: { latest: RecentResourceItem | undefined }) => {

    if (!latest) {
        return (
            <Link
                href="/resources"
                className="group flex items-center justify-between gap-4 border rounded-xl p-6 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                <div>
                    <p className="font-display text-xs uppercase tracking-wide text-foreground-tertiary mb-1">
                        Get started
                    </p>
                    <p className="font-semibold text-foreground">Browse resources for your program and semester</p>
                </div>
                <ArrowUpRight className="size-5 text-foreground-tertiary shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
            </Link>
        );
    }

    return (
        <Link
            href={`/resources/r/${latest.resourceId}`}
            className="group flex items-center justify-between gap-4 border rounded-xl p-6 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className="size-11 rounded-lg bg-background-tertiary flex items-center justify-center shrink-0">
                    <File className="size-5 text-foreground-secondary" />
                </div>
                <div className="min-w-0">
                    <p className="font-display text-xs uppercase tracking-wide text-foreground-tertiary mb-1">
                        Continue where you left off
                    </p>
                    <p className="font-semibold text-foreground truncate">{latest.resource.title}</p>
                    <p className="text-sm text-foreground-secondary mt-0.5 truncate">
                        {latest.resource.subjectOffering?.subject?.code} &middot; Viewed {getRelativeTime(latest.accessedAt)}
                    </p>
                </div>
            </div>
            <ArrowUpRight className="size-5 text-foreground-tertiary shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
        </Link>
    );
};

interface PreviewPanelProps {
    title: string;
    viewAllHref: string;
    tiles: React.ReactNode[];
    emptyText: string;
}

const PreviewPanel = ({ title, viewAllHref, tiles, emptyText }: PreviewPanelProps) => (
    <div>
        <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <Link href={viewAllHref} className="text-xs font-medium text-foreground-secondary hover:text-foreground transition-colors shrink-0">
                View all
            </Link>
        </div>

        {tiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {tiles}
            </div>
        ) : (
            <p className="text-sm text-foreground-secondary">{emptyText}</p>
        )}
    </div>
);

const LibraryHub = () => {
    const { data: recentResourcesData } = useRecentResources();
    const { data: bookmarkedResourcesData } = useBookmarkedResources();
    const { data: uploadedResourcesData } = useUploadedResources();

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <p className="font-display text-xs tracking-[0.2em] uppercase text-foreground-tertiary">
                    Library
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    My Library
                </h1>
                <p className="text-foreground-secondary text-base leading-relaxed">
                    Everything tied to you: recently viewed, bookmarked, and uploaded resources.
                </p>
            </div>

            <ContinueCard latest={recentResourcesData?.items?.[0]} />

            <StatStrip
                items={[
                    { href: "/library/recent", label: "Recently viewed", value: recentResourcesData?.meta?.total },
                    { href: "/library/bookmarks", label: "Bookmarked", value: bookmarkedResourcesData?.meta?.total },
                    { href: "/library/uploads", label: "Uploaded", value: uploadedResourcesData?.meta?.total },
                ]}
            />

            <div className="flex flex-col gap-8">
                <PreviewPanel
                    title="Recently bookmarked"
                    viewAllHref="/library/bookmarks"
                    emptyText="Nothing bookmarked yet."
                    tiles={(bookmarkedResourcesData?.items ?? []).slice(0, 3).map((item) => (
                        <ResourcePreviewTile
                            key={item.resourceId}
                            resourceId={item.resourceId}
                            title={item.resource.title}
                            subjectCode={item.resource.subjectOffering?.subject?.code}
                            typeLabel={ResourceTypeLabel[item.resource.type]}
                            timeLabel={getRelativeTime(item.bookmarkedAt)}
                        />
                    ))}
                />

                <PreviewPanel
                    title="Recently uploaded"
                    viewAllHref="/library/uploads"
                    emptyText="Nothing shared yet."
                    tiles={(uploadedResourcesData?.items ?? []).slice(0, 3).map((item) => (
                        <ResourcePreviewTile
                            key={item.id}
                            resourceId={item.id}
                            title={item.title}
                            subjectCode={item.subjectOffering?.subject?.code}
                            typeLabel={ResourceTypeLabel[item.type]}
                            timeLabel={getRelativeTime(item.createdAt)}
                        />
                    ))}
                />
            </div>
        </div>
    );
};

export default LibraryHub;
