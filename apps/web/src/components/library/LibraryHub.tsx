"use client";
import Link from "next/link";
import { Bookmark, File, History, ShoppingBag, UploadCloud } from "lucide-react";

import StatStrip from "@/components/ui/StatStrip";
import { JumpBackIn, ResourcePreviewTile } from "@/components/common/resources";
import { PreviewPanel } from "@/components/common/list";
import { BookSpines, DEFAULT_SHELF_SPINES } from "@/components/decor";
import { useRecentResources, useBookmarkedResources, useUploadedResources, useMyMarketplaceListings } from "@/hooks/queries/use-me";
import { getRelativeTime } from "@/utils/time";
import { ResourceTypeLabel } from "@/types/entities";
import type { BookmarkedResourceItem } from "@/types/api";

// Trades ResourcePreviewTile's icon/bookmark/uploader detail for density in the narrow sidebar column.
const BookmarkListRow = ({ resourceId, title, subjectCode }: { resourceId: number; title: string; subjectCode?: string }) => (
    <Link
        href={`/resources/r/${resourceId}`}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-background-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
    >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background-tertiary">
            <File className="size-3.5 text-foreground-secondary" />
        </span>
        <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{title}</p>
            {subjectCode && <p className="text-xs text-foreground-secondary truncate">{subjectCode}</p>}
        </div>
    </Link>
);

const RecentlyBookmarkedPanel = ({ items }: { items: BookmarkedResourceItem[] }) => (
    <div>
        <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recently Bookmarked</h3>
            <Link href="/library/bookmarks" className="text-xs font-medium text-foreground-secondary hover:text-foreground transition-colors shrink-0">
                View all
            </Link>
        </div>

        {items.length > 0 ? (
            <div className="rounded-xl border border-border bg-background-secondary divide-y divide-border">
                {items.map((item) => (
                    <BookmarkListRow
                        key={item.resourceId}
                        resourceId={item.resourceId}
                        title={item.resource.title}
                        subjectCode={item.resource.subjectOffering?.subject?.code}
                    />
                ))}
            </div>
        ) : (
            <p className="text-sm text-foreground-secondary">Nothing bookmarked yet.</p>
        )}
    </div>
);

const LibraryHub = () => {
    const { data: recentResourcesData } = useRecentResources();
    const { data: bookmarkedResourcesData } = useBookmarkedResources();
    const { data: uploadedResourcesData } = useUploadedResources();
    const { data: myListingsData } = useMyMarketplaceListings();

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-background-secondary p-6 sm:p-8">
                <BookSpines spines={DEFAULT_SHELF_SPINES} />

                <div className="relative z-10 space-y-2 max-w-md">
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
            </div>

            <div className="pb-8 border-b border-border">
                <StatStrip
                    variant="cards"
                    className="sm:grid-cols-4"
                    items={[
                        { href: "/library/recent", label: "Recently viewed", value: recentResourcesData?.meta?.total, icon: History },
                        { href: "/library/bookmarks", label: "Bookmarked", value: bookmarkedResourcesData?.meta?.total, icon: Bookmark },
                        { href: "/library/uploads", label: "Uploaded", value: uploadedResourcesData?.meta?.total, icon: UploadCloud },
                        { href: "/library/marketplace", label: "Listings", value: myListingsData?.meta?.total, icon: ShoppingBag },
                    ]}
                />
            </div>

            {/* Stacked so a shorter Recently Bookmarked column never leaves a gap. */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <JumpBackIn />

                    <PreviewPanel
                        title="My Uploads"
                        viewAllHref="/library/uploads"
                        emptyText="Nothing shared yet."
                        columns={2}
                        tiles={(uploadedResourcesData?.items ?? []).slice(0, 2).map((item) => (
                            <ResourcePreviewTile
                                key={item.id}
                                resourceId={item.id}
                                title={item.title}
                                subjectCode={item.subjectOffering?.subject?.code}
                                typeLabel={ResourceTypeLabel[item.type]}
                                timeLabel={`Uploaded ${getRelativeTime(item.createdAt)}`}
                            />
                        ))}
                    />
                </div>

                <RecentlyBookmarkedPanel items={(bookmarkedResourcesData?.items ?? []).slice(0, 5)} />
            </div>
        </div>
    );
};

export default LibraryHub;
