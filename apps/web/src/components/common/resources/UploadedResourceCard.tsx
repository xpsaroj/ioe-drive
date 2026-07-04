import ResourceCard from "./ResourceCard";
import EditResourceButton from "./EditResourceButton";
import DeleteResourceButton from "./DeleteResourceButton";
import type { ResourceSummary } from "@/types/api";

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
    return (
        <ResourceCard
            resource={item}
            actions={
                showOwnerActions ? (
                    <div className="flex items-center gap-1 shrink-0 border p-0.5 rounded-lg">
                        <EditResourceButton resource={item} />
                        <DeleteResourceButton resourceId={item.id} />
                    </div>
                ) : undefined
            }
        />
    );
};

export default UploadedResourceCard;
