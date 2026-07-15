import Link from "next/link";
import { File, FileArchive, FileImage, FileJson, FileSpreadsheet, FileText, Presentation, type LucideIcon } from "lucide-react";

import { getMimeKey, getMimeLabel } from "./MimeTypeBadge";
import { formatFileSize } from "@/utils/file";
import type { ResourceFileSummary } from "@/types/api";

export interface FileTypeMeta {
    icon: LucideIcon;
    className: string;
}

export const FILE_TYPE_META: Record<string, FileTypeMeta> = {
    pdf: { icon: FileText, className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    png: { icon: FileImage, className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
    jpg: { icon: FileImage, className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
    jpeg: { icon: FileImage, className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
    document: { icon: FileText, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    sheet: { icon: FileSpreadsheet, className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    "ms-excel": { icon: FileSpreadsheet, className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    presentation: { icon: Presentation, className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    "ms-powerpoint": { icon: Presentation, className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    json: { icon: FileJson, className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    zip: { icon: FileArchive, className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
};

export const DEFAULT_FILE_TYPE_META: FileTypeMeta = {
    icon: File,
    className: "bg-background-tertiary text-foreground-secondary",
};

interface ResourceFileItemProps {
    file: ResourceFileSummary;
}

// Sized to its content, not a full-width row, so several can wrap wherever a resource's files are listed.
const ResourceFileItem = ({ file }: ResourceFileItemProps) => {
    const { id: fileId, resourceId, originalFileName, mimeType, fileSize } = file;
    const { icon: Icon, className } = FILE_TYPE_META[getMimeKey(mimeType)] ?? DEFAULT_FILE_TYPE_META;

    return (
        <Link
            href={`/resources/r/${resourceId}/files/${fileId}`}
            className="flex w-full items-center gap-2.5 rounded-lg border border-border p-2 transition-colors duration-150 hover:border-foreground-tertiary hover:bg-background-tertiary sm:w-auto sm:max-w-[220px]"
        >
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-md ${className}`}>
                <Icon className="size-4" />
            </span>
            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{originalFileName}</p>
                <p className="font-display text-[10px] uppercase tracking-wide text-foreground-tertiary flex items-center gap-2">
                    <span>{getMimeLabel(mimeType)}</span>
                    <span>{formatFileSize(fileSize)}</span>
                </p>
            </div>
        </Link>
    )
}

export default ResourceFileItem;
