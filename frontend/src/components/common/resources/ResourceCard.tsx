import ResourceFileList from "./ResourceFileList";
import type { NoteWithFiles } from "@/types";

interface ResourceCardProps {
    resource: NoteWithFiles;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
    const { title, description, files } = resource;
    
    return (
        <div className="md:border py-3 md:p-6 md:rounded-md">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-foreground-secondary text-sm">{description}</p>
            <ResourceFileList resourceFiles={files || []} />
        </div>
    )
}

export default ResourceCard;