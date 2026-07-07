"use client";
import Link from "next/link";

import ResourcePreviewTile from "./ResourcePreviewTile";
import { useRecentResources } from "@/hooks/queries/use-me";
import { getRelativeTime } from "@/utils/time";
import { ResourceTypeLabel } from "@/types/entities";

interface JumpBackInProps {
  /** How many recent resources to show - defaults to 2 (a single row). */
  limit?: number;
}

/**
 * A quick "continue where you left off" grid of recently-viewed resources. Shared
 * between the dashboard and the library hub, both of which want the same section.
 */
const JumpBackIn = ({ limit = 2 }: JumpBackInProps) => {
  const { data, isPending } = useRecentResources(1);
  const items = data?.items.slice(0, limit);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground">Jump Back In</h2>
        <Link href="/library/recent" className="text-xs font-medium text-foreground-secondary hover:text-foreground transition-colors shrink-0">
          View history
        </Link>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="h-36 rounded-xl bg-skeleton-base animate-pulse" />
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <ResourcePreviewTile
              key={item.resourceId}
              resourceId={item.resourceId}
              title={item.resource.title}
              subjectCode={item.resource.subjectOffering?.subject?.code}
              typeLabel={ResourceTypeLabel[item.resource.type]}
              timeLabel={`Viewed ${getRelativeTime(item.accessedAt)}`}
              uploader={item.resource.uploader}
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

export default JumpBackIn;
