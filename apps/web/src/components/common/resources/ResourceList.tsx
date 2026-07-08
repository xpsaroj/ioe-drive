import type { ReactNode } from "react";

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
            <div className="border md:p-6 p-0 px-6 py-3 rounded-lg bg-card-background flex flex-col md:gap-6 divide-y divide-border">
                {Array.from({ length: 3 }).map((_, index) => (
                    <ResourceCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="border p-6 rounded-lg bg-card-background flex flex-col gap-6">
                <p className="text-error text-sm">{error}</p>
            </div>
        )
    }

    if (!resources || resources.length === 0) {
        return (
            <div className="border p-6 rounded-lg bg-card-background flex flex-col gap-6">
                <p className="text-sm text-foreground-tertiary">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="border md:p-6 p-0 px-6 py-3 rounded-lg bg-card-background flex flex-col md:gap-6 divide-y md:divide-none divide-border">
            {resources.map((resource, index) => (
                <div key={index}>
                    {renderItem(resource)}
                </div>
            ))}
        </div>
    )
}

export default ResourceList;