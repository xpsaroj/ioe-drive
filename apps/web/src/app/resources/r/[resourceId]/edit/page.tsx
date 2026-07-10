"use client"
import { use } from "react"
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { useResource } from "@/hooks/queries/use-resources";
import { useMe } from "@/hooks/queries/use-me";
import Button from "@/components/ui/Button";
import { PageStateHandler } from "@/components/layout";
import { ResourceEditForm, ResourceFilesManager } from "@/components/common/resources";

interface ResourceEditPageProps {
    params: Promise<{
        resourceId: string;
    }>
}

const ResourceEditPage = ({
    params
}: ResourceEditPageProps) => {
    const { resourceId: rId } = use(params);
    const resourceId = Number(rId);

    const router = useRouter();

    const { data: resource, isPending, error } = useResource(resourceId);
    const { data: userData, isPending: userPending } = useMe();

    const header = (
        <div className="flex items-center gap-2 mb-4">
            <Button
                icon={<ChevronLeft className="size-4" />}
                iconOnly
                variant="ghost"
                size="xs"
                className="border border-border"
                onClick={() => router.back()}
                aria-label="Go back"
            />
                <h3 className="text-xl md:text-2xl font-medium">Edit Resource</h3>
        </div>
    )

    const emptyContent = (
        <div className="flex flex-col justify-center items-center">
            <p className="text-4xl">404</p>
            <p className="text-foreground-secondary">The resource you are looking for does not exist.</p>
        </div>
    )

    const isMissing = !resourceId || isNaN(resourceId) || !resource;

    if (isMissing || isPending || userPending) {
        return (
            <PageStateHandler
                isPending={isPending || userPending}
                error={error}
                isEmpty={!isPending && !userPending && isMissing}
                header={header}
                loaderText="Loading resource details. Please wait."
                emptyContent={emptyContent}
            >
                {null}
            </PageStateHandler>
        );
    }

    const isOwner = !!userData && !!resource.uploadedBy && userData.id === resource.uploadedBy;

    if (!isOwner) {
        return (
            <div className="min-h-screen bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">
                {header}
                <div className="border rounded-lg flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <p className="text-lg font-medium">You can&apos;t edit this resource.</p>
                        <p className="text-foreground-secondary text-sm">
                            Only the person who uploaded a resource can edit it.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">
            {header}
            <ResourceEditForm
                resource={resource}
                filesPanel={<ResourceFilesManager resource={resource} />}
            />
        </div>
    )
}

export default ResourceEditPage;
