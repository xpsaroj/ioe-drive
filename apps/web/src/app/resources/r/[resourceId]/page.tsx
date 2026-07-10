"use client"
import { Suspense, use, useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Download, Lightbulb } from "lucide-react";
import { toast } from "sonner";

import { useResource, useDownloadFile, useSimilarResources } from "@/hooks/queries/use-resources";
import { useSubjectDetails } from "@/hooks/queries/use-academics";
import { useMe, useMarkResourceAsRecentlyAccessed } from "@/hooks/queries/use-me";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import type { BreadcrumbItem } from "@/components/layout";
import { ResourceFileList, ResourcePageStateHandler, EditResourceButton, DeleteResourceButton, BookmarkButton } from "@/components/common/resources";
import { UploaderInfo } from "@/components/common/user";
import { SubjectCodeTile } from "@/components/common/offering";
import { ResourceTypeLabel, SemesterLabel } from "@/types/entities";

interface ResourceDetailPageProps {
    params: Promise<{
        resourceId: string;
    }>
}

const SIMILAR_RESOURCES_SHOWN = 4;

const ResourceDetailContent = ({
    params
}: ResourceDetailPageProps) => {
    const { resourceId: rId } = use(params);
    const resourceId = Number(rId);

    const router = useRouter();

    const { data: resource, isPending, error } = useResource(resourceId);
    const { data: userData } = useMe();
    const isOwner = !!userData && !!resource?.uploadedBy && userData.id === resource.uploadedBy;

    const { data: offeringDetails } = useSubjectDetails(resource?.subjectOffering.id ?? 0);
    const { data: similarResources, isPending: similarPending } = useSimilarResources(resourceId, SIMILAR_RESOURCES_SHOWN);

    const { mutateAsync: requestDownload } = useDownloadFile(resourceId);
    const [isDownloadingAll, setIsDownloadingAll] = useState(false);

    const { mutate: markAsRecentlyAccessed } = useMarkResourceAsRecentlyAccessed();

    useEffect(() => {
        if (userData && resource) {
            markAsRecentlyAccessed(String(resource.id));
        }
        // Depend on userData.id (not the userData object) so an unrelated profile
        // refetch producing a new object reference doesn't re-fire this. mutate's
        // identity is stable across renders (TanStack Query), so it's fine to omit.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData?.id, resource?.id]);

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Resources", href: "/resources" },
        { label: resource?.title ?? "Resource" },
    ];

    const backButton = (
        <Button
            icon={<ChevronLeft className="size-4" />}
            iconOnly
            variant="ghost"
            size="xs"
            className="border border-border shrink-0"
            onClick={() => router.back()}
            aria-label="Go back"
        />
    );

    // The badge sits right next to the title itself (via the composed `title` node
    // below) rather than here, so this only needs to hold owner-only actions. The
    // bookmark toggle lives as a prominent "Save" button in the body.
    const actions = resource && isOwner ? (
        <div className="flex items-center gap-1 shrink-0 border border-border p-0.5 rounded-lg">
            <EditResourceButton resource={resource} />
            <DeleteResourceButton
                resourceId={resource.id}
                onDeleted={() => router.push("/library/uploads")}
            />
        </div>
    ) : undefined;

    const title = resource ? (
        <>
            {resource.title}
            <Badge size="sm" className="align-middle">{ResourceTypeLabel[resource.type]}</Badge>
        </>
    ) : "Resource Details";

    const isMissing = !resourceId || isNaN(resourceId) || !resource;

    if (isMissing) {
        return (
            <ResourcePageStateHandler
                title={title}
                breadcrumbs={breadcrumbs}
                beforeBreadcrumb={backButton}
                isPending={isPending}
                error={error}
                isEmpty={true}
                loaderText="Loading resource details. Please wait."
                emptyTitle="Resource not found"
                emptyDescription="This resource may have been removed, or the link you followed is incorrect."
                emptyButtonText="Browse Resources"
                emptyButtonHref="/resources"
            >
                {null}
            </ResourcePageStateHandler>
        );
    }

    const { files = [], subjectOffering } = resource;
    const createdAt = new Date(resource.createdAt);
    const formattedCreatedAt = createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const handleDownloadAll = async () => {
        setIsDownloadingAll(true);
        try {
            for (const file of files) {
                const url = await requestDownload(file.id);
                window.open(url, "_blank");
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to download some files.");
        } finally {
            setIsDownloadingAll(false);
        }
    };

    return (
        <ResourcePageStateHandler
            title={title}
            breadcrumbs={breadcrumbs}
            beforeBreadcrumb={backButton}
            actions={actions}
            isPending={isPending}
            error={error}
            isEmpty={false}
            loaderText="Loading resource details. Please wait."
            emptyTitle="Resource not found"
            emptyDescription="This resource may have been removed, or the link you followed is incorrect."
            emptyButtonText="Browse Resources"
            emptyButtonHref="/resources"
        >
            <div className="space-y-8">
                <div className="flex flex-col gap-4 pb-8 border-b border-border sm:flex-row sm:items-center sm:justify-between">
                    <UploaderInfo
                        user={resource.uploader}
                        subtitle={formattedCreatedAt}
                        size="md"
                    />

                    {userData && (
                        <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center sm:shrink-0">
                            <BookmarkButton resourceId={resource.id} showLabel />
                            <Button
                                icon={<Download className="size-4" />}
                                onClick={handleDownloadAll}
                                disabled={isDownloadingAll || files.length === 0}
                            >
                                {isDownloadingAll ? "Preparing..." : "Download All"}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                        <div className="rounded-xl border border-border p-6">
                            <h2 className="mb-3 text-lg font-semibold text-foreground">Description</h2>
                            <p className="text-foreground-secondary leading-relaxed">{resource.description}</p>
                        </div>

                        <div className="rounded-xl border border-border p-6">
                            <ResourceFileList resourceFiles={files} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border border-border p-6">
                            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
                                Related Subject
                            </p>
                            <div className="flex items-center gap-3 mb-4">
                                <SubjectCodeTile code={subjectOffering.subject.code} size="md" />
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-foreground">{subjectOffering.subject.name}</p>
                                    <p className="text-xs text-foreground-secondary flex items-center gap-2">
                                        <span>{subjectOffering.subject.code}</span>
                                        {offeringDetails && <span>{SemesterLabel[offeringDetails.semester]} Semester</span>}
                                    </p>
                                </div>
                            </div>
                            <Button href={`/offerings/${subjectOffering.id}`} variant="secondary" size="sm" className="w-full">
                                View Subject Page
                            </Button>
                        </div>

                        <div className="rounded-xl border border-border p-6">
                            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
                                <Lightbulb className="size-3.5" />
                                Similar Resources
                            </div>
                            {similarPending ? (
                                <div className="-mx-6 divide-y divide-border">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 px-6 py-3">
                                            <div className="h-4 w-full animate-pulse rounded bg-skeleton-base" />
                                        </div>
                                    ))}
                                </div>
                            ) : similarResources && similarResources.length > 0 ? (
                                <div className="-mx-6 divide-y divide-border">
                                    {similarResources.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/resources/r/${item.id}`}
                                            className="flex items-center justify-between gap-3 px-6 py-3 transition-colors hover:bg-background-hover"
                                        >
                                            <p className="truncate text-sm text-foreground">{item.title}</p>
                                            <Badge size="sm" className="shrink-0">{ResourceTypeLabel[item.type]}</Badge>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-foreground-tertiary">
                                    No other resources shared for this subject yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ResourcePageStateHandler>
    )
}

const ResourceDetailPage = (props: ResourceDetailPageProps) => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <Loader text="Loading resource details. Please wait." />
            </div>
        }>
            <ResourceDetailContent {...props} />
        </Suspense>
    );
}

export default ResourceDetailPage;
