import Link from "next/link";

import MimeTypeBadge from "./MimeTypeBadge";
import { NoteFile as NoteFileType } from "@/types";

interface NoteFileProps {
    file: NoteFileType;
}

const NoteFile = ({ file }: NoteFileProps) => {
    const { id: fileId, originalFileName, mimeType } = file;

    return (
        <Link href={`/preview/resources/files/${fileId}`} className="border p-1 flex flex-row items-center gap-1 rounded-lg">
            <MimeTypeBadge mimeType={mimeType} />
            <p className="text-xs">{originalFileName}</p>
        </Link>
    )
}

export default NoteFile;