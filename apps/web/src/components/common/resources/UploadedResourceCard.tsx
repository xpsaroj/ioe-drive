import ResourceCard from "./ResourceCard";
import type { NoteCard } from "@/types/api";

interface Props {
    item: NoteCard;
}

const UploadedResourceCard = ({ item }: Props) => {
    return <ResourceCard resource={item} />;
};

export default UploadedResourceCard;