"use client"
import { Suspense } from "react";

import { ResourceList, UploadedResourceCard, ResourcePageStateHandler } from "@/components/common/resources";
import Pagination from "@/components/common/Pagination";
import Loader from "@/components/ui/Loader";
import { useUploadedResources } from "@/hooks/queries/use-me";
import { usePageParam } from "@/hooks/use-page-param";

const MyUploadedResourcesContent = () => {
    const { page, setPage } = usePageParam();
    const { data, isPending, error, isPlaceholderData } = useUploadedResources(page);
    const uploadedResources = data?.items;

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
            <div className="space-y-6">
                <ResourceList
                    resources={uploadedResources || []}
                    renderItem={(item) => <UploadedResourceCard item={item} showOwnerActions />}
                />
                <Pagination
                    page={page}
                    totalPages={data?.meta?.totalPages ?? 1}
                    onPageChange={setPage}
                    disabled={isPlaceholderData}
                />
            </div>
        </ResourcePageStateHandler>
    )
}

const MyUploadedResourcesPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <Loader text="Loading uploaded resources. Please wait." />
            </div>
        }>
            <MyUploadedResourcesContent />
        </Suspense>
    );
}

export default MyUploadedResourcesPage;
