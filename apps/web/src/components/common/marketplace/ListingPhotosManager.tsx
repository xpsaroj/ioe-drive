"use client";
import { useState } from "react";
import { CloudUpload, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/utils/cn";
import { formatFileSize } from "@/utils/file";
import { partitionUploadablePhotos, MAX_LISTING_PHOTOS, ACCEPTED_LISTING_PHOTO_EXTENSIONS } from "@/utils/marketplace-file";
import { useAddListingPhotos, useRemoveListingPhoto } from "@/hooks/queries/use-marketplace";
import type { ListingPhotoSummary, ListingSummary } from "@/types/api";

interface ListingPhotosManagerProps {
    listing: ListingSummary;
}

const ExistingPhotoRow = ({
    photo,
    onRemove,
    disabled,
}: {
    photo: ListingPhotoSummary;
    onRemove: () => void;
    disabled: boolean;
}) => {
    return (
        <div className="flex items-center gap-2.5 rounded-lg border border-border p-2">
            {/* Signed URLs are per-request and short-lived - plain <img>, not an oversight. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.photoUrl} alt={photo.originalFileName} className="size-9 shrink-0 rounded-md object-cover" />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{photo.originalFileName}</p>
                <p className="text-xs text-foreground-tertiary">{formatFileSize(photo.fileSize)}</p>
            </div>
            <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                aria-label={`Remove ${photo.originalFileName}`}
                className="shrink-0 rounded-md p-1 text-foreground-tertiary transition-colors hover:bg-background-tertiary hover:text-error disabled:cursor-not-allowed disabled:opacity-60"
            >
                <Trash2 className="size-4" />
            </button>
        </div>
    );
};

// Unlike the upload form's staged queue, add/remove here applies immediately - no confirm step.
const ListingPhotosManager = ({ listing }: ListingPhotosManagerProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const { mutate: addPhotos, isPending: isAdding } = useAddListingPhotos(listing.id);
    const { mutate: removePhoto, isPending: isRemoving } = useRemoveListingPhoto(listing.id);
    const photos = listing.photos ?? [];

    const uploadPhotos = (incoming: File[]) => {
        if (isAdding || incoming.length === 0) return;

        const { accepted, rejected } = partitionUploadablePhotos(incoming, photos.length);

        if (rejected.length > 0) {
            toast.error(`Couldn't add ${rejected.join(", ")}`);
        }
        if (accepted.length === 0) return;

        const formData = new FormData();
        accepted.forEach((file) => formData.append("listingPhoto", file));

        addPhotos(formData, {
            onSuccess: () => {
                toast.success(accepted.length > 1 ? "Photos added successfully." : "Photo added successfully.");
            },
            onError: (error) => {
                toast.error(error instanceof Error ? error.message : "Failed to add photos.");
            },
        });
    };

    const handlePhotosSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        uploadPhotos(Array.from(e.target.files ?? []));
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        uploadPhotos(Array.from(e.dataTransfer.files ?? []));
    };

    const handleRemove = (photoId: number, fileName: string) => {
        if (photos.length <= 1) {
            toast.error("A listing must have at least one photo.");
            return;
        }

        removePhoto(photoId, {
            onSuccess: () => {
                toast.success(`Removed "${fileName}".`);
            },
            onError: (error) => {
                toast.error(error instanceof Error ? error.message : "Failed to remove photo.");
            },
        });
    };

    return (
        <div className="rounded-xl border border-border p-6">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">Photos</h2>
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
                onClick={() => !isAdding && document.getElementById("listingPhotosManagerInput")?.click()}
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
                    {isAdding ? "Uploading..." : "Drag & Drop photos here"}
                </p>
                <p className="mt-1 text-xs text-foreground-secondary">or click to browse from your computer</p>
                <p className="mt-3 inline-block rounded-md bg-background-tertiary px-2.5 py-1 font-display text-[10px] uppercase tracking-wide text-foreground-tertiary">
                    JPG, PNG, WEBP | up to 10 MB | max {MAX_LISTING_PHOTOS} photos
                </p>
                <input
                    id="listingPhotosManagerInput"
                    type="file"
                    multiple
                    accept={ACCEPTED_LISTING_PHOTO_EXTENSIONS}
                    onChange={handlePhotosSelected}
                    disabled={isAdding}
                    className="hidden"
                />
            </div>

            {photos.length === 0 ? (
                <p className="mt-4 text-xs text-foreground-tertiary">No photos attached to this listing.</p>
            ) : (
                <div className="mt-4 flex flex-col gap-2">
                    {photos.map((photo) => (
                        <ExistingPhotoRow
                            key={photo.id}
                            photo={photo}
                            disabled={isRemoving || photos.length <= 1}
                            onRemove={() => handleRemove(photo.id, photo.originalFileName)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListingPhotosManager;
