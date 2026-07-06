import type { BookmarkedResourceItem } from "@/types/api";
import { getRelativeTime } from "@/utils/time";
import ResourceCard from "./ResourceCard";
import type { ResourceOrigin } from "@/utils/resourceLink";

interface Props {
    item: BookmarkedResourceItem;
    /** Where this card is shown - lets the resource detail page's breadcrumb offer a
     * real way back to it. */
    from?: ResourceOrigin;
}

const BookmarkedResourceCard = ({ item, from }: Props) => {
    const { bookmarkedAt, resource } = item;

    return (
        <ResourceCard
            resource={resource}
            meta={`Saved ${getRelativeTime(bookmarkedAt)}`}
            from={from}
        />
    );
};

export default BookmarkedResourceCard;
