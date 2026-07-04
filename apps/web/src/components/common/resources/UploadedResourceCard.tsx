import ResourceCard from "./ResourceCard";
import type { ResourceSummary } from "@/types/api";

interface Props {
    item: ResourceSummary;
}

const UploadedResourceCard = ({ item }: Props) => {
    return <ResourceCard resource={item} />;
};

export default UploadedResourceCard;
