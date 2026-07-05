"use client";
import Link from "next/link";

import { ResourcePreviewTile } from "@/components/common/resources";
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
            <ResourcePreviewTile
              key={item.resourceId}
              resourceId={item.resourceId}
              title={item.resource.title}
              subjectCode={item.resource.subjectOffering?.subject?.code}
              typeLabel={ResourceTypeLabel[item.resource.type]}
              timeLabel={getRelativeTime(item.accessedAt)}
            />
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
