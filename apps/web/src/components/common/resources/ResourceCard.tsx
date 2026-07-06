import Link from "next/link";

import ResourceFileList from "./ResourceFileList";
import BookmarkButton from "./BookmarkButton";
import type { ResourceSummary } from "@/types/api";
import { UploaderInfo } from "@/components/common/user";
import { resourceDetailHref, type ResourceOrigin } from "@/utils/resourceLink";

interface ResourceCardProps {
    resource: ResourceSummary;
    meta?: string;
    /**
     * Optional action buttons (e.g. edit/delete for the resource's owner), rendered
     * next to the title.
     */
    actions?: React.ReactNode;
    /** Where this card is shown (Resource Explorer, a library list, a profile, etc.) -
     * lets the resource detail page's breadcrumb offer a real way back to it. */
    from?: ResourceOrigin;
}

const ResourceCard = ({
    resource,
    meta,
    actions,
    from,
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
        <div className="md:border py-3 my-4 md:my-0 md:p-6 md:rounded-md">
            {meta && (
                <p className="text-xs text-foreground-tertiary mb-1">
                    {meta}
                </p>
            )}

            <div className="md-flex justify-between items-start space-y-6">
                <div className="flex flex-col items-start justify-between gap-2">
                    <div className="flex items-center justify-between gap-2 w-full">
                        <Link
                            href={resourceDetailHref(resource.id, from)}
                            className="text-lg font-semibold hover:underline decoration-2 underline-offset-3"
                        >
                            {title}
                        </Link>
                        <div className="flex items-center gap-1 shrink-0 border p-0.5 rounded-lg">
                            <BookmarkButton resourceId={resource.id} />
                            {actions}
                        </div>
                    </div>

                    <div className="">
                        <p className="text-foreground-secondary text-sm">{description}</p>
                    </div>
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
                        {subjectOffering?.subject?.code} <span className="hidden sm:inline">• {subjectOffering?.subject?.name}</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ResourceCard;