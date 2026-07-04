"use client";
import { useRef } from "react";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/ui/Button";
import MimeTypeBadge from "./MimeTypeBadge";
import { useAddResourceFiles, useRemoveResourceFile } from "@/hooks/queries/use-resources";
import type { ResourceSummary } from "@/types/api";

interface ResourceFilesManagerProps {
    resource: ResourceSummary;
}

/**
 * Lets the owner of a resource add or remove files after the fact, independent of the
 * metadata edit form's own save cycle - each action (add/remove) applies immediately,
 * same as deleting the whole resource already does.
 */
const ResourceFilesManager = ({ resource }: ResourceFilesManagerProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: addFiles, isPending: isAdding } = useAddResourceFiles(resource.id);
    const { mutate: removeFile, isPending: isRemoving } = useRemoveResourceFile(resource.id);
    const files = resource.files ?? [];

    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        e.target.value = "";
        if (!selected || selected.length === 0) return;

        const formData = new FormData();
        Array.from(selected).forEach((file) => formData.append("resourceFile", file));

        addFiles(formData, {
            onSuccess: () => {
                toast.success(selected.length > 1 ? "Files added successfully." : "File added successfully.");
            },
            onError: (error) => {
                toast.error(error instanceof Error ? error.message : "Failed to add files.");
            },
        });
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
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p className="font-medium text-sm">Files</p>
                <Button
                    type="button"
                    variant="secondary"
                    size="xs"
                    icon={<Upload className="size-3.5" />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAdding}
                >
                    {isAdding ? "Uploading..." : "Add Files"}
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFilesSelected}
                />
            </div>

            {files.length === 0 ? (
                <p className="text-xs text-foreground-tertiary">No files attached to this resource.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between gap-2 border rounded-lg p-2"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <MimeTypeBadge mimeType={file.mimeType} />
                                <span className="text-sm truncate">{file.originalFileName}</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                iconOnly
                                icon={<Trash2 className="size-4" />}
                                onClick={() => handleRemove(file.id, file.originalFileName)}
                                disabled={isRemoving}
                                className="text-error/80 hover:text-error hover:bg-error/10 shrink-0"
                                aria-label={`Remove ${file.originalFileName}`}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResourceFilesManager;
