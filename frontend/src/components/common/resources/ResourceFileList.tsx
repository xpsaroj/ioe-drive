import ResourceFileItem from "./ResourceFileItem";
import type { NoteFile } from "@/types";

interface ResourceFileListProps {
    resourceFiles: NoteFile[];
    loading?: boolean;
    error?: string | null;
}

const ResourceFileList = ({
    resourceFiles,
    loading = false,
    error = null,
}: ResourceFileListProps) => {
    if (loading) {
        return (
            <div className="mt-3">
                <p className="text-xs text-foreground-tertiary">Loading files. Please wait...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mt-3">
                <p className="text-xs text-error">Error loading files. Please try again.</p>
            </div>
        )
    }

    if (!resourceFiles || resourceFiles.length === 0) {
        return (
            <div className="mt-3">
                <p className="text-xs text-foreground-tertiary">No files attached to this note.</p>
            </div>
        )
    }

    return (
        <div className="mt-3">
            <p className="font-medium mb-1">Files</p>
            <div className="flex flex-row flex-wrap items-center gap-2">
                {resourceFiles.map((file) => (
                    <ResourceFileItem key={file.id} file={file} />
                ))}
            </div>
        </div>
    )
}

export default ResourceFileList;