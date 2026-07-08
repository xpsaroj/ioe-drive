"use client";
import { useState } from "react";
import { CloudUpload, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/utils/cn";
import { formatFileSize, partitionUploadableFiles, MAX_FILES_PER_UPLOAD, ACCEPTED_UPLOAD_FILE_EXTENSIONS } from "@/utils/file";
import { useAddResourceFiles, useRemoveResourceFile } from "@/hooks/queries/use-resources";
import { FILE_TYPE_META, DEFAULT_FILE_TYPE_META } from "./ResourceFileItem";
import { getMimeKey } from "./MimeTypeBadge";
import type { ResourceFileSummary, ResourceSummary } from "@/types/api";

interface ResourceFilesManagerProps {
    resource: ResourceSummary;
}

const ExistingFileRow = ({
    file,
    onRemove,
    disabled,
}: {
    file: ResourceFileSummary;
    onRemove: () => void;
    disabled: boolean;
}) => {
    const { icon: Icon, className } = FILE_TYPE_META[getMimeKey(file.mimeType)] ?? DEFAULT_FILE_TYPE_META;

    return (
        <div className="flex items-center gap-2.5 rounded-lg border border-border p-2">
            <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-md", className)}>
                <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{file.originalFileName}</p>
                <p className="text-xs text-foreground-tertiary">{formatFileSize(file.fileSize)}</p>
            </div>
            <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                aria-label={`Remove ${file.originalFileName}`}
                className="shrink-0 rounded-md p-1 text-foreground-tertiary transition-colors hover:bg-background-tertiary hover:text-error disabled:cursor-not-allowed disabled:opacity-60"
            >
                <Trash2 className="size-4" />
            </button>
        </div>
    );
};

/**
 * Lets the owner of a resource add or remove files after the fact, independent of the
 * metadata edit form's own save cycle - each action (add/remove) applies immediately,
 * same as deleting the whole resource already does. Unlike the upload form's staged
 * queue, there's no "confirm" step here - a dropped/selected file starts uploading
 * right away, since it isn't tied to a broader form submission.
 */
const ResourceFilesManager = ({ resource }: ResourceFilesManagerProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const { mutate: addFiles, isPending: isAdding } = useAddResourceFiles(resource.id);
    const { mutate: removeFile, isPending: isRemoving } = useRemoveResourceFile(resource.id);
    const files = resource.files ?? [];

    const uploadFiles = (incoming: File[]) => {
        if (isAdding || incoming.length === 0) return;

        const { accepted, rejected } = partitionUploadableFiles(incoming, files.length);

        if (rejected.length > 0) {
            toast.error(`Couldn't add ${rejected.join(", ")}`);
        }
        if (accepted.length === 0) return;

        const formData = new FormData();
        accepted.forEach((file) => formData.append("resourceFile", file));

        addFiles(formData, {
            onSuccess: () => {
                toast.success(accepted.length > 1 ? "Files added successfully." : "File added successfully.");
            },
            onError: (error) => {
                toast.error(error instanceof Error ? error.message : "Failed to add files.");
            },
        });
    };

    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        uploadFiles(Array.from(e.target.files ?? []));
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        uploadFiles(Array.from(e.dataTransfer.files ?? []));
    };

    const handleRemove = (fileId: number, fileName: string) => {
        removeFile(fileId, {
            onSuccess: () => {
                toast.success(`Removed "${fileName}".`);
            },
            onError: (error) => {
                toast.error(error instanceof Error ? error.message : "Failed to remove file.");
            },
        });
    };

    return (
        <div className="rounded-xl border border-border p-6">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">Files</h2>
                <p className="mt-0.5 text-xs text-foreground-tertiary">
                    Changes here save instantly &mdash; no need to hit Save Changes.
                </p>
            </div>

            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!isAdding) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !isAdding && document.getElementById("resourceFilesManagerInput")?.click()}
                className={cn(
                    "rounded-xl border-2 border-dashed p-6 text-center transition-colors",
                    isAdding ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-foreground-tertiary",
                    isDragging ? "border-accent bg-accent/5" : "border-border",
                )}
            >
                <span className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <CloudUpload className="size-5" />
                </span>
                <p className="text-sm font-semibold text-foreground">
                    {isAdding ? "Uploading..." : "Drag & Drop files here"}
                </p>
                <p className="mt-1 text-xs text-foreground-secondary">or click to browse from your computer</p>
                <p className="mt-3 inline-block rounded-md bg-background-tertiary px-2.5 py-1 font-display text-[10px] uppercase tracking-wide text-foreground-tertiary">
                    PDF, DOC/DOCX, JPG, PNG &middot; up to 10 MB &middot; max {MAX_FILES_PER_UPLOAD} files
                </p>
                <input
                    id="resourceFilesManagerInput"
                    type="file"
                    multiple
                    accept={ACCEPTED_UPLOAD_FILE_EXTENSIONS}
                    onChange={handleFilesSelected}
                    disabled={isAdding}
                    className="hidden"
                />
            </div>

            {files.length === 0 ? (
                <p className="mt-4 text-xs text-foreground-tertiary">No files attached to this resource.</p>
            ) : (
                <div className="mt-4 flex flex-col gap-2">
                    {files.map((file) => (
                        <ExistingFileRow
                            key={file.id}
                            file={file}
                            disabled={isRemoving}
                            onRemove={() => handleRemove(file.id, file.originalFileName)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResourceFilesManager;
