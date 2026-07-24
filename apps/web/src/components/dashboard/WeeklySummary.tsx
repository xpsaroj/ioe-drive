"use client";
import { Share2, Eye, Bookmark } from "lucide-react";

import { useWeeklySummary } from "@/hooks/queries/use-me";

const WeeklySummary = () => {
    const { data, isPending } = useWeeklySummary();

    const stats = [
        { icon: Share2, label: "Resources Shared", value: data?.resourcesShared },
        { icon: Eye, label: "Resources Viewed", value: data?.resourcesViewed },
        { icon: Bookmark, label: "Resources Bookmarked", value: data?.resourcesBookmarked },
    ];

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-lg font-semibold text-foreground mb-6">This Week</h2>
            {/* flex-1 so this box stretches to match Jump Back In's card height on desktop
            (where the grid row's height is set by the taller column) - on mobile the two
            sections stack instead, so there's no extra height to fill, and this is a no-op. */}
            <div className="flex-1 flex flex-col rounded-xl border border-border bg-background-secondary divide-y divide-border">
                {stats.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex-1 flex items-center justify-between gap-4 px-4 py-4">
                        <div className="flex items-center gap-2.5 text-sm text-foreground-secondary">
                            <Icon className="size-4 shrink-0" />
                            {label}
                        </div>
                        {isPending ? (
                            <div className="h-4 w-6 animate-pulse rounded bg-skeleton-base" />
                        ) : (
                            <span className="text-sm font-semibold text-foreground">{value ?? 0}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklySummary;
