import ResourceCard from "./ResourceCard";
import EditResourceButton from "./EditResourceButton";
import DeleteResourceButton from "./DeleteResourceButton";
import type { ResourceSummary } from "@/types/api";
import { ModerationReasonLabel, ResourceStatus } from "@/types/entities";

interface Props {
    item: ResourceSummary;
    /**
     * Whether to show Edit/Delete controls on this card. Only pass this where every
     * resource shown is guaranteed to belong to the current user (e.g. "My Uploads") -
     * this card is also reused on other users' public profiles, where it must stay false.
     */
    showOwnerActions?: boolean;
}

const UploadedResourceCard = ({ item, showOwnerActions = false }: Props) => {
    // There's no notification system in this app - this is how an uploader finds out
    // their resource was rejected/removed and why, the next time they check their own
    // uploads.
    const showModerationNotice = item.status === ResourceStatus.REJECTED || item.status === ResourceStatus.REMOVED;

    return (
        <div className="space-y-2">
            <ResourceCard
                resource={item}
                actions={
                    showOwnerActions ? (
                        <div className="flex items-center gap-1 shrink-0">
                            <EditResourceButton resource={item} />
                            <DeleteResourceButton resourceId={item.id} />
                        </div>
                    ) : undefined
                }
            />

            {showModerationNotice && (
                <div className="rounded-lg border border-border bg-background-tertiary px-4 py-3 text-sm">
                    <p className="font-medium text-foreground">
                        {item.status === ResourceStatus.REMOVED ? "This resource was removed" : "This resource was rejected"}
                        {item.moderationReason && `: ${ModerationReasonLabel[item.moderationReason]}`}
                    </p>
                    {item.moderationNote && (
                        <p className="mt-1 text-foreground-secondary">{item.moderationNote}</p>
                    )}
                    {item.status === ResourceStatus.REJECTED && (
                        <p className="mt-1 text-foreground-secondary">Edit this resource to resubmit it for review.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default UploadedResourceCard;
