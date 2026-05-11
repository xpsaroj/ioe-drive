import Link from "next/link";

import type { RecentNoteItem } from "@/types/api";
import { getRelativeTime } from "@/utils/time";
import ResourceFileList from "./ResourceFileList";
import { UploaderInfo } from "@/components/common/user";

interface Props {
    item: RecentNoteItem;
}

const RecentResourceCard = ({ item }: Props) => {
    const { note, accessedAt } = item;
    const { files = [], subjectOffering } = note;

    const createdAt = new Date(note.createdAt);
    const formattedCreatedAt = createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div className="md:border py-3 md:p-6 md:rounded-md">
            <p className="text-xs text-foreground-tertiary mb-1">
                Viewed {getRelativeTime(accessedAt)}
            </p>

            <div className="md:flex justify-between items-start">
                <div className="space-y-4">
                    <div>
                        <Link href={`/resources/r/${note.id}`} className="text-lg font-semibold hover:underline decoration-2 underline-offset-3">{note.title}</Link>
                        <p className="text-sm text-foreground-secondary">
                            {note.description}
                        </p>
                    </div>

                    <ResourceFileList resourceFiles={files} />

                    <div className="flex justify-between items-end mt-4">
                        <UploaderInfo
                            user={note.uploader}
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

export default RecentResourceCard;