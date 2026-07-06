import type { RecentResourceItem } from "@/types/api";
import { getRelativeTime } from "@/utils/time";
import ResourceCard from "./ResourceCard";
import type { ResourceOrigin } from "@/utils/resourceLink";

interface Props {
    item: RecentResourceItem;
    /** Where this card is shown - lets the resource detail page's breadcrumb offer a
     * real way back to it. */
    from?: ResourceOrigin;
}

const RecentResourceCard = ({ item, from }: Props) => {
    const { accessedAt, resource } = item;

    return (
        <ResourceCard
            resource={resource}
            meta={`Viewed ${getRelativeTime(accessedAt)}`}
            from={from}
        />
    );
};

export default RecentResourceCard;
