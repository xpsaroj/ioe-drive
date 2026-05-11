import Link from "next/link";

import type { NoteCard } from "@/types/api";
import ResourceFileList from "./ResourceFileList";
import { UploaderInfo } from "@/components/common/user";

interface Props {
    item: NoteCard;
}

const UploadedNoteCard = ({ item }: Props) => {
    const { subjectOffering, files = [] } = item;

    const createdAt = new Date(item.createdAt);
    const formattedCreatedAt = createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div className="md:border py-3 md:p-6 md:rounded-md">
            <div className="md:flex justify-between items-start">
                <div className="space-y-4">
                    <div>
                        <Link href={`/resources/r/${item.id}`} className="text-lg font-semibold hover:underline decoration-2 underline-offset-3">{item.title}</Link>
                        <p className="text-sm text-foreground-secondary">
                            {item.description}
                        </p>
                    </div>

                    <ResourceFileList resourceFiles={files} />

                    <div className="flex justify-between items-end mt-4">
                        <UploaderInfo
                            user={item.uploader}
                            subtitle={formattedCreatedAt}
                        />

                        <Link
                            href={`/offerings/${subjectOffering.id}`}
                            className="text-xs text-foreground-secondary hover:underline hover:text-foreground"
                        >
                            {subjectOffering?.subject?.code} • {subjectOffering?.subject?.name}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadedNoteCard;