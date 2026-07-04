"use client"
import { ResourceList, UploadedResourceCard, ResourcePageStateHandler } from "@/components/common/resources";
import { useUploadedResources } from "@/hooks/queries/use-me";

const MyUploadedResourcesPage = () => {
    const { data: uploadedResources, isPending, error } = useUploadedResources();

    return (
        <ResourcePageStateHandler
            title="My Uploaded Resources"
            isPending={isPending}
            error={error}
            isEmpty={!uploadedResources || uploadedResources.length === 0}
            loaderText="Loading uploaded resources. Please wait."
            emptyTitle="Oops. Looks like you haven't uploaded any resources yet."
            emptyDescription="Share resources (notes, books, past questions, etc.) to help your peers and juniors succeed in their studies. Once you upload resources, you'll be able to see them here."
            emptyButtonText="Share Resources"
            emptyButtonHref="/resources/share"
        >
            <ResourceList
                resources={uploadedResources || []}
                renderItem={(item) => <UploadedResourceCard item={item} />}
            />
        </ResourcePageStateHandler>
    )
}

export default MyUploadedResourcesPage;
