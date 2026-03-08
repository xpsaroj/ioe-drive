import ResourceCard from "./ResourceCard";
import ResourceCardSkeleton from "./ResourceCardSkeleton";
import type { NoteWithFiles } from "@/types"

interface ResourceListProps {
    resources: NoteWithFiles[];
    loading?: boolean;
    error?: string;
}

const ResourceList = ({ resources, loading, error }: ResourceListProps) => {
    if (loading) {
        return (
            <div className="border p-6 rounded-lg bg-white flex flex-col gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                    <ResourceCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="border p-6 rounded-lg bg-white flex flex-col gap-6">
                <p className="text-error text-sm">Error loading resources. Please try again.</p>
            </div>
        )
    }

    if (!resources || resources.length === 0) {
        return (
            <div className="border p-6 rounded-lg bg-white flex flex-col gap-6">
                <p className="text-sm text-foreground-tertiary">No resources found for this subject.</p>
            </div>
        )
    }

    return (
        <div className="border p-6 rounded-lg bg-white flex flex-col gap-6">
            {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
            ))}
        </div>
    )
}

export default ResourceList;