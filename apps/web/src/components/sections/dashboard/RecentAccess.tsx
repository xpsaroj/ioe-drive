"use client";
import Link from "next/link";
import { File } from "lucide-react";

import { useRecentResources } from "@/hooks/queries/use-me";
import { getRelativeTime } from "@/utils/time";
import { ResourceTypeLabel } from "@/types/entities";

const RecentAccess = () => {
  const { data, isPending } = useRecentResources(1);
  const items = data?.items.slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recently accessed</h3>
          <p className="text-sm text-foreground-secondary mt-0.5">
            Jump back to where you left off.
          </p>
        </div>
        <Link href="/library/recent" className="text-xs font-medium text-foreground-secondary hover:text-foreground transition-colors shrink-0">
          View all
        </Link>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-skeleton-base animate-pulse" />
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              key={item.resourceId}
              href={`/resources/r/${item.resourceId}`}
              className="group flex flex-col gap-3 border rounded-xl p-4 transition-all duration-150 hover:border-accent hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex items-center justify-between">
                <div className="size-9 rounded-md bg-background-tertiary flex items-center justify-center">
                  <File className="size-4 text-foreground-secondary" />
                </div>
                <span className="font-display text-[10px] uppercase tracking-wide text-foreground-tertiary">
                  {getRelativeTime(item.accessedAt)}
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:underline underline-offset-2">
                  {item.resource.title}
                </p>
                <p className="text-xs text-foreground-secondary mt-1">
                  {item.resource.subjectOffering?.subject?.code} &middot; {ResourceTypeLabel[item.resource.type]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-foreground-secondary">
          You haven&apos;t viewed any resources yet.
        </p>
      )}
    </div>
  );
};

export default RecentAccess;
