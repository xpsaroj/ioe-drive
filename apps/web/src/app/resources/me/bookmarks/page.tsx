"use client"
import { ResourceList, BookmarkedResourceCard, ResourcePageStateHandler } from "@/components/common/resources";
import { useBookmarkedResources } from "@/hooks/queries/use-me";

const MyBookmarkedResourcesPage = () => {
    const { data: bookmarkedResources, isPending, error } = useBookmarkedResources();

    return (
        <ResourcePageStateHandler
            title="My Bookmarked Resources"
            isPending={isPending}
            error={error}
            isEmpty={!bookmarkedResources || bookmarkedResources.length === 0}
            loaderText="Loading bookmarked resources. Please wait."
            emptyTitle="Oops. Looks like you haven't bookmarked any resources yet."
            emptyDescription="Click the bookmark icon on resources to save them for later. Once you bookmark resources, you'll be able to see them here."
            emptyButtonText="Explore Current Semester Resources"
            emptyButtonHref="/resources/current"
        >
            <ResourceList
                resources={bookmarkedResources || []}
                renderItem={(item) => <BookmarkedResourceCard item={item} />}
            />
        </ResourcePageStateHandler>
    )
}

export default MyBookmarkedResourcesPage;
