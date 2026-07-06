import ResourceCard from "./ResourceCard";
import EditResourceButton from "./EditResourceButton";
import DeleteResourceButton from "./DeleteResourceButton";
import type { ResourceSummary } from "@/types/api";
import type { ResourceOrigin } from "@/utils/resourceLink";

interface Props {
    item: ResourceSummary;
    /**
     * Whether to show Edit/Delete controls on this card. Only pass this where every
     * resource shown is guaranteed to belong to the current user (e.g. "My Uploads") -
     * this card is also reused on other users' public profiles, where it must stay false.
     */
    showOwnerActions?: boolean;
    /** Where this card is shown - lets the resource detail page's breadcrumb offer a
     * real way back to it. */
    from?: ResourceOrigin;
}

const UploadedResourceCard = ({ item, showOwnerActions = false, from }: Props) => {
    return (
        <ResourceCard
            resource={item}
            from={from}
            actions={
                showOwnerActions ? (
                    <div className="flex items-center gap-1 shrink-0">
                        <EditResourceButton resource={item} />
                        <DeleteResourceButton resourceId={item.id} />
                    </div>
                ) : undefined
            }
        />
    );
};

export default UploadedResourceCard;
