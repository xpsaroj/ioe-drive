import type { RecentNoteItem } from "@/types/api";
import { getRelativeTime } from "@/utils/time";
import ResourceCard from "./ResourceCard";

interface Props {
    item: RecentNoteItem;
}

const RecentResourceCard = ({ item }: Props) => {
    const { accessedAt, note } = item;

    return (
        <ResourceCard
            resource={note}
            meta={`Viewed ${getRelativeTime(accessedAt)}`}
        />
    );
};

export default RecentResourceCard;