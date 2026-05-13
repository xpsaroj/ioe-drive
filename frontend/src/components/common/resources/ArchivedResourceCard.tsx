import type { ArchivedNoteItem } from "@/types/api";
import { getRelativeTime } from "@/utils/time";
import ResourceCard from "./ResourceCard";

interface Props {
    item: ArchivedNoteItem;
}

const ArchivedResourceCard = ({ item }: Props) => {
    const { archivedAt, note } = item;
    
    return (
        <ResourceCard
            resource={note}
            meta={`Saved ${getRelativeTime(archivedAt)}`}
        />
    );
};

export default ArchivedResourceCard;