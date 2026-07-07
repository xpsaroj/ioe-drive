"use client"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Download, FileWarning, PanelRightClose, PanelRightOpen } from "lucide-react";

import { useResource, useFileDownloadUrl, useDownloadFile } from "@/hooks/queries/use-resources";
import { useMe, useMarkResourceAsRecentlyAccessed } from "@/hooks/queries/use-me";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { PageStateHandler } from "@/components/layout";
import { MimeTypeBadge } from "@/components/common/resources";
import { UploaderInfo } from "@/components/common/user";

interface FilePreviewPageProps {
    params: Promise<{
        resourceId: string;
        fileId: string;
    }>
}

// Types the browser can render natively, without any third-party viewer/conversion.
const INLINE_PREVIEWABLE_MIME_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

const FilePreviewPage = ({
    params
}: FilePreviewPageProps) => {
    const { resourceId: rId, fileId: fId } = use(params);
    const resourceId = Number(rId);
    const fileId = Number(fId);

    const router = useRouter();

    const { data: resource, isPending, error } = useResource(resourceId);
    const activeFile = resource?.files.find((file) => file.id === fileId);

    const {
        data: downloadData,
        isPending: urlPending,
        isError: urlError,
        refetch: refetchDownloadUrl,
    } = useFileDownloadUrl(resourceId, activeFile?.id);

    const { mutate: requestDownload, isPending: isPreparingDownload } = useDownloadFile(resourceId);

    const { data: userData } = useMe();
    const { mutate: markAsRecentlyAccessed } = useMarkResourceAsRecentlyAccessed();

    const [hasRetriedImage, setHasRetriedImage] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    const isMissing = !resourceId || !fileId || isNaN(resourceId) || isNaN(fileId) || !resource || !activeFile;

    useEffect(() => {
        if (userData && resource) {
            markAsRecentlyAccessed(String(resource.id));
        }
        // Depend on userData.id (not the userData object) so an unrelated profile
        // refetch producing a new object reference doesn't re-fire this. mutate's
        // identity is stable across renders (TanStack Query), so it's fine to omit.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData?.id, resource?.id]);

    const handleDownload = () => {
        if (!activeFile) return;
        requestDownload(activeFile.id, {
            onSuccess: (url) => {
                window.location.href = url;
            },
        });
    };

    const handleImageError = () => {
        // The signed URL is short-lived - if it's already expired by the time the
        // browser actually requests it (e.g. a tab left open for a while), fetch a
        // fresh one and try exactly once more before giving up.
        if (!hasRetriedImage) {
            setHasRetriedImage(true);
            refetchDownloadUrl();
        }
    };

    const header = (
        <div className="flex items-center gap-2 mb-4 min-w-0">
            <Button
                icon={<ChevronLeft className="size-4" />}
                iconOnly
                variant="ghost"
                size="xs"
                className="border border-border shrink-0"
                onClick={() => router.back()}
                aria-label="Go back"
            />
            <h1 className="text-lg md:text-xl font-medium truncate">
                {activeFile?.originalFileName ?? "File Preview"}
            </h1>
        </div>
    )

    const emptyContent = (
        <div className="flex flex-col justify-center items-center">
            <p className="text-4xl">404</p>
            <p className="text-foreground-secondary">This file could not be found.</p>
        </div>
    )

    if (isMissing || isPending) {
        return (
            <PageStateHandler
                isPending={isPending}
                error={error}
                isEmpty={!isPending && isMissing}
                header={header}
                loaderText="Loading file details. Please wait."
                emptyContent={emptyContent}
            >
                {null}
            </PageStateHandler>
        );
    }

    const canPreviewInline = INLINE_PREVIEWABLE_MIME_TYPES.has(activeFile.mimeType);

    const createdAt = new Date(resource.createdAt);
    const formattedCreatedAt = createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div className="min-h-screen bg-background text-foreground p-0 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Main preview pane - grows to fill the space the header/download bar used to take.
                    A fixed viewport-relative height on mobile (rather than flex-1 alone) - in the
                    md:flex-row layout flex-1's main axis is horizontal so h-screen applies to height
                    normally, but stacked in flex-col, flex-1's flex-basis:0 would otherwise collapse
                    this pane's height instead of respecting h-screen. Ordered after the side panel on
                    mobile (details first, preview below) but before it in the desktop row. */}
                <div className="order-2 w-full h-screen md:order-1 md:flex-1 flex items-center justify-center">
                    {urlPending ? (
                        <Loader text="Preparing preview..." />
                    ) : urlError || !downloadData ? (
                        <p className="text-error text-sm">Couldn&apos;t load this file&apos;s preview.</p>
                    ) : !canPreviewInline ? (
                        <div className="flex flex-col items-center gap-3 text-center py-10">
                            <FileWarning className="size-10 text-foreground-tertiary" />
                            <p className="text-sm text-foreground-secondary">
                                Preview isn&apos;t available for this file type. Download it to view it.
                            </p>
                        </div>
                    ) : activeFile.mimeType === "application/pdf" ? (
                        <iframe
                            src={downloadData.url}
                            title={activeFile.originalFileName}
                            className="w-full h-full"
                        />
                    ) : (
                        // Signed URLs are per-request and short-lived, so next/image's
                        // optimizer/cache is a poor fit here - a plain <img> is the
                        // correct choice, not an oversight.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={downloadData.url}
                            alt={activeFile.originalFileName}
                            onError={handleImageError}
                            className="max-w-full max-h-full rounded-md object-contain"
                        />
                    )}
                </div>

                {/* Side panel: resource details + file switcher. Sticky on desktop so it
                    stays in view while a tall preview (e.g. a long PDF) scrolls past. Not
                    rendered at all while collapsed, so the main pane's flex-1 takes the
                    full row - the toggle to bring it back floats separately below. */}
                {showSidebar && (
                    <div className="order-1 w-full md:order-2 md:w-80 shrink-0 flex flex-col gap-4 md:sticky self-start px-4 pt-4 md:px-0 md:pe-6">
                        <div className="flex items-center gap-2">
                            <Button
                                icon={<ChevronLeft className="size-4" />}
                                iconOnly
                                variant="ghost"
                                size="xs"
                                className="border border-border shrink-0"
                                onClick={() => router.back()}
                                aria-label="Go back"
                            />
                            <div className="flex items-center gap-2 ms-auto">
                                <Button
                                    icon={<Download className="size-4" />}
                                    iconOnly
                                    variant="primary"
                                    size="xs"
                                    onClick={handleDownload}
                                    disabled={isPreparingDownload}
                                    aria-label={isPreparingDownload ? "Preparing download..." : "Download file"}
                                />
                                {/* Collapsing the side panel only makes sense on desktop, where it
                                    frees up horizontal space next to the preview - on mobile the
                                    panel already stacks above the preview, so there's nothing to
                                    reclaim by hiding it. `hidden md:contents` (rather than putting
                                    `hidden` directly on the Button) avoids fighting the Button's
                                    own base `inline-flex` class for which wins at the same
                                    (unprefixed) breakpoint. */}
                                <div className="hidden md:contents">
                                    <Button
                                        icon={<PanelRightClose className="size-4" />}
                                        iconOnly
                                        variant="ghost"
                                        size="xs"
                                        className="border border-border"
                                        onClick={() => setShowSidebar(false)}
                                        aria-label="Hide details"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border p-5">
                            <Link
                                href={`/resources/r/${resource.id}`}
                                className="text-lg font-semibold text-foreground hover:underline"
                            >
                                {resource.title}
                            </Link>
                            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                                {resource.description}
                            </p>

                            <div className="mt-4 border-t border-border pt-4">
                                <UploaderInfo user={resource.uploader} subtitle={formattedCreatedAt} />
                            </div>

                            <Link
                                href={`/offerings/${resource.subjectOffering.id}`}
                                className="mt-4 flex items-center gap-1.5 border-t border-border pt-4 text-xs text-foreground-secondary hover:text-foreground hover:underline"
                            >
                                <span className="font-medium text-foreground">{resource.subjectOffering.subject.code}</span>
                                <span className="truncate">{resource.subjectOffering.subject.name}</span>
                            </Link>
                        </div>

                        <div className="rounded-xl border border-border p-5">
                            <p className="mb-3 font-display text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
                                Attached files
                            </p>
                            <div className="flex flex-col gap-1.5">
                                {resource.files.map((file) => (
                                    <Link
                                        key={file.id}
                                        href={`/resources/r/${resource.id}/files/${file.id}`}
                                        className={`flex items-center gap-2 rounded-md border p-2 text-sm transition-colors ${file.id === activeFile.id
                                            ? "border-accent bg-background-tertiary"
                                            : "border-border hover:bg-background-tertiary"
                                            }`}
                                    >
                                        <MimeTypeBadge mimeType={file.mimeType} />
                                        <span className="truncate">{file.originalFileName}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating toggle to bring the side panel back - overlays the now full-width
                main pane instead of taking up flex layout space. */}
            {!showSidebar && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-4 p-0 md:flex items-center justify-center backdrop-blur-sm border"
                    icon={<PanelRightOpen className="size-5" />}
                    iconOnly
                    onClick={() => setShowSidebar(true)}
                    aria-label="Show details"
                />
            )}
        </div>
    )
}

export default FilePreviewPage;
