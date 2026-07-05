"use client"
import { use, useEffect } from "react"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { useResource } from "@/hooks/queries/use-resources";
import { useMe, useMarkResourceAsRecentlyAccessed } from "@/hooks/queries/use-me";
import Button from "@/components/ui/Button";
import { PageStateHandler } from "@/components/layout";
import { ResourceFileList, EditResourceButton, DeleteResourceButton } from "@/components/common/resources";
import { UploaderInfo } from "@/components/common/user";

interface ResourceDetailPageProps {
    params: Promise<{
        resourceId: string;
    }>
}

const ResourceDetailPage = ({
    params
}: ResourceDetailPageProps) => {
    const { resourceId: rId } = use(params);
    const resourceId = Number(rId);

    const router = useRouter();

    const { data: resource, isPending, error } = useResource(resourceId);
    const { data: userData } = useMe();
    const isOwner = !!userData && !!resource?.uploadedBy && userData.id === resource.uploadedBy;

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

    const header = (
        <div className="flex items-center gap-2 mb-4">
            <Button
                icon={<ChevronLeft className="size-4" />}
                iconOnly
                variant="ghost"
                size="xs"
                className="border border-border"
                onClick={() => router.back()}
            />
            <h1 className="text-xl md:text-2xl font-medium">Resource Details</h1>
        </div>
    )

    const emptyContent = (
        <div className="flex flex-col justify-center items-center">
            <p className="text-4xl">404</p>
            <p className="text-foreground-secondary">The resource you are looking for does not exist.</p>
        </div>
    )

    if (!resourceId || isNaN(resourceId) || !resource) {
        return (
            <PageStateHandler
                isPending={isPending}
                error={error}
                isEmpty={true}
                header={header}
                loaderText="Loading resource details. Please wait."
                emptyContent={emptyContent}
            >
                {null}
            </PageStateHandler>
        );
    }

    const { files = [], subjectOffering } = resource;
    const createdAt = new Date(resource.createdAt);
    const formattedCreatedAt = createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });


    return (
        <PageStateHandler
            isPending={isPending}
            error={error}
            isEmpty={!resource}
            loaderText="Loading resource details. Please wait."
            header={header}
            emptyContent={emptyContent}
        >
            <div className="flex flex-col justify-center border gap-1 rounded-lg py-3 md:p-6">
                <div className="mb-3 pb-3 border-b">
                    <h2 className="text-xl font-semibold">{subjectOffering.subject.name} Resources</h2>
                    <Link
                        href={`/offerings/${subjectOffering.id}`}
                        className="text-sm text-foreground-secondary hover:underline hover:text-foreground"
                    >
                        {subjectOffering.subject.code} • {subjectOffering.subject.name}
                    </Link>
                </div>

                <div className="border-b pb-3 mb-3">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-bold">{resource.title}</h3>

                        {isOwner && (
                            <div className="flex items-center gap-1 shrink-0 border p-0.5 rounded-lg">
                                <EditResourceButton resource={resource} />
                                <DeleteResourceButton
                                    resourceId={resource.id}
                                    onDeleted={() => router.push("/library/uploads")}
                                />
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-foreground-tertiary flex items-center gap-1 mt-3">
                        <UploaderInfo
                            user={resource.uploader}
                            subtitle={formattedCreatedAt}
                        />
                    </div>
                </div>

                <p className="text-foreground border-b pb-3 mb-3">{resource.description}</p>
                <ResourceFileList resourceFiles={files} />
            </div>
        </PageStateHandler>
    )
}

export default ResourceDetailPage;