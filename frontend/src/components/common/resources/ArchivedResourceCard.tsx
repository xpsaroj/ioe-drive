import Link from "next/link";
import type { ArchivedNote } from "@/types";
import ResourceFileList from "./ResourceFileList";
import { getRelativeTime } from "@/utils/time";
import { User2 } from "lucide-react";

interface Props {
    item: ArchivedNote;
}

const ArchivedResourceCard = ({ item }: Props) => {
    const { note, archivedAt } = item;
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
                Saved {getRelativeTime(archivedAt)}
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
                        {note.uploader && (
                            <div className="text-xs text-foreground-tertiary flex items-center gap-1">
                                <User2 className="inline size-6 rounded-full border p-1.5 box-content" />
                                <div className="flex flex-col">
                                    <span className="text-foreground-secondary">{note.uploader.fullName}</span>
                                    <span>{formattedCreatedAt}</span>
                                </div>
                            </div>
                        )}

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

export default ArchivedResourceCard;