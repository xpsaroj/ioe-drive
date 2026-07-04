import Link from "next/link";

import ResourceFileList from "./ResourceFileList";
import type { ResourceSummary } from "@/types/api";
import { UploaderInfo } from "@/components/common/user";

interface ResourceCardProps {
    resource: ResourceSummary;
    meta?: string;
    /**
     * Optional action buttons (e.g. edit/delete for the resource's owner), rendered
     * next to the title.
     */
    actions?: React.ReactNode;
}

const ResourceCard = ({
    resource,
    meta,
    actions,
}: ResourceCardProps) => {
    const {
        title,
        description,
        files = [],
        uploader,
        subjectOffering,
    } = resource;

    const createdAt = new Date(resource.createdAt);
    const formattedCreatedAt = createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div className="md:border py-3 md:p-6 md:rounded-md">
            {meta && (
                <p className="text-xs text-foreground-tertiary mb-1">
                    {meta}
                </p>
            )}

            <div className="md-flex justify-between items-start space-y-4">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <Link
                            href={`/resources/r/${resource.id}`}
                            className="text-lg font-semibold hover:underline decoration-2 underline-offset-3"
                        >
                            {title}
                        </Link>
                        <p className="text-foreground-secondary text-sm">{description}</p>
                    </div>

                    {actions && (
                        <div className="flex items-center gap-1 shrink-0">
                            {actions}
                        </div>
                    )}
                </div>

                <ResourceFileList resourceFiles={files} />

                <div className="flex justify-between items-end mt-4">
                    <UploaderInfo
                        user={uploader}
                        subtitle={formattedCreatedAt}
                    />

                    <Link
                        href={`/offerings/${subjectOffering.id}`}
                        className="text-xs text-foreground-secondary hover:underline hover:text-foreground"
                    >
                        {subjectOffering?.subject?.code} • {subjectOffering?.subject?.name}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ResourceCard;