import Link from "next/link";

import MimeTypeBadge from "./MimeTypeBadge";
import { NoteFileSummary } from "@/types/api";

interface NoteFileProps {
    file: NoteFileSummary;
}

const NoteFile = ({ file }: NoteFileProps) => {
    const { id: fileId, originalFileName, mimeType } = file;

    return (
        <Link href={`/preview/resources/files/${fileId}`} className="border p-1 flex flex-row items-center gap-1 rounded-lg hover:bg-background-tertiary hover:border-foreground-tertiary transition-all duration-200">
            <MimeTypeBadge mimeType={mimeType} />
            <p className="text-xs">{originalFileName}</p>
        </Link>
    )
}

export default NoteFile;