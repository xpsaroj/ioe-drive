import ResourceFileList from "./ResourceFileList";
import type { NoteWithFiles } from "@/types";

interface ResourceCardProps {
    resource: NoteWithFiles;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
    const { title, description, files } = resource;

    return (
        <div className="md:border py-3 md:p-6 md:rounded-md space-y-4">
            <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-foreground-secondary text-sm">{description}</p>
            </div>
            <ResourceFileList resourceFiles={files || []} />
        </div>
    )
}

export default ResourceCard;