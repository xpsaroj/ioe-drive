import Link from "next/link";

import ResourceFileList from "./ResourceFileList";
import type { NoteCard } from "@/types/api";
import { UploaderInfo } from "@/components/common/user";

interface ResourceCardProps {
    resource: NoteCard;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
    const { title, description, files, uploader } = resource;
    
    const createdAt = new Date(resource.createdAt);
    const formattedCreatedAt = createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div className="md:border py-3 md:p-6 md:rounded-md space-y-4">
            <div>
                <Link href={`/resources/r/${resource.id}`} className="text-lg font-semibold hover:underline decoration-2 underline-offset-3">{title}</Link>
                <p className="text-foreground-secondary text-sm">{description}</p>
            </div>
            <ResourceFileList resourceFiles={files || []} />

            <div className="flex justify-between items-end mt-4">
                        <UploaderInfo
                            user={uploader}
                            subtitle={formattedCreatedAt}
                        />

                        <Link
                            href={`/offerings/${resource.subjectOffering.id}`}
                            className="text-xs text-foreground-secondary hover:underline hover:text-foreground"
                        >
                            {resource.subjectOffering?.subject?.code} • {resource.subjectOffering?.subject?.name}
                        </Link>
                    </div>
        </div>
    )
}

export default ResourceCard;