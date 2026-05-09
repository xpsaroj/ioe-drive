import Link from "next/link";
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
                <Link href={`/resources/r/${resource.id}`} className="text-lg font-semibold hover:underline decoration-2 underline-offset-3">{title}</Link>
                <p className="text-foreground-secondary text-sm">{description}</p>
            </div>
            <ResourceFileList resourceFiles={files || []} />
        </div>
    )
}

export default ResourceCard;