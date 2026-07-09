import type { ReactNode } from "react";
import { Inbox, AlertCircle } from "lucide-react";

import ResourceCardSkeleton from "./ResourceCardSkeleton";

interface ResourceListProps<T> {
    resources: T[];
    loading?: boolean;
    error?: string | null;
    renderItem: (item: T) => ReactNode;
    emptyMessage?: string;
}

const ResourceList = <T,>({
    resources,
    loading,
    error,
    renderItem,
    emptyMessage = "No resources found.",
}: ResourceListProps<T>) => {
    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <ResourceCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border py-16">
                <AlertCircle className="size-5 text-error" />
                <p className="text-error text-sm">{error}</p>
            </div>
        )
    }

    if (!resources || resources.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-border py-16">
                <Inbox className="size-5 text-foreground-tertiary" />
                <p className="text-sm text-foreground-tertiary">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {resources.map((resource, index) => (
                <div key={index}>
                    {renderItem(resource)}
                </div>
            ))}
        </div>
    )
}

export default ResourceList;
