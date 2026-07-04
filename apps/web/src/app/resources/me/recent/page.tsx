"use client"
import { ResourceList, RecentResourceCard, ResourcePageStateHandler } from "@/components/common/resources";
import { useRecentResources } from "@/hooks/queries/use-me";

const MyRecentResourcesPage = () => {
    const { data: recentResources, isPending, error } = useRecentResources();

    return (
        <ResourcePageStateHandler
            title="My Recent Resources"
            isPending={isPending}
            error={error}
            isEmpty={!recentResources || recentResources.length === 0}
            loaderText="Loading recent resources. Please wait."
            emptyTitle="Oops. Looks like you haven't viewed any resources recently."
            emptyDescription="Start exploring resources for your subjects to see them here."
            emptyButtonText="Explore Current Semester Resources"
            emptyButtonHref="/resources/current"
        >
            <ResourceList
                resources={recentResources || []}
                renderItem={(item) => <RecentResourceCard item={item} />}
            />
        </ResourcePageStateHandler>
    )
}

export default MyRecentResourcesPage;
