"use client"
import { Suspense } from "react";

import { ResourceList, BookmarkedResourceCard, ResourcePageStateHandler } from "@/components/common/resources";
import Pagination from "@/components/common/Pagination";
import Loader from "@/components/ui/Loader";
import { useBookmarkedResources } from "@/hooks/queries/use-me";
import { usePageParam } from "@/hooks/use-page-param";

const MyBookmarkedResourcesContent = () => {
    const { page, setPage } = usePageParam();
    const { data, isPending, error, isPlaceholderData } = useBookmarkedResources(page);
    const bookmarkedResources = data?.items;

    return (
        <ResourcePageStateHandler
            title="My Bookmarked Resources"
            breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Bookmarks" }]}
            isPending={isPending}
            error={error}
            isEmpty={!bookmarkedResources || bookmarkedResources.length === 0}
            loaderText="Loading bookmarked resources. Please wait."
            emptyTitle="Oops. Looks like you haven't bookmarked any resources yet."
            emptyDescription="Click the bookmark icon on resources to save them for later. Once you bookmark resources, you'll be able to see them here."
            emptyButtonText="Explore Resources"
            emptyButtonHref="/resources"
        >
            <div className="space-y-6">
                <ResourceList
                    resources={bookmarkedResources || []}
                    renderItem={(item) => <BookmarkedResourceCard item={item} />}
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

const MyBookmarkedResourcesPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <Loader text="Loading bookmarked resources. Please wait." />
            </div>
        }>
            <MyBookmarkedResourcesContent />
        </Suspense>
    );
}

export default MyBookmarkedResourcesPage;
