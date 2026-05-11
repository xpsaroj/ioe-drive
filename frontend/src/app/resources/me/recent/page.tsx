"use client"
import { UploadedResourceList, RecentResourceCard, ResourcePageStateHandler } from "@/components/common/resources";
import { useRecentNotes } from "@/hooks/queries/use-me";

const MyRecentNotesPage = () => {
    const { data: recentNotes, isPending, error } = useRecentNotes();

    return (
        <ResourcePageStateHandler
            title="My Recent Notes"
            isPending={isPending}
            error={error}
            isEmpty={!recentNotes || recentNotes.length === 0}
            loaderText="Loading recent notes. Please wait."
            emptyTitle="Oops. Looks like you haven't viewed any notes recently."
            emptyDescription="Start exploring notes for your subjects to see them here."
            emptyButtonText="Explore Current Semester Notes"
            emptyButtonHref="/resources/current"
        >
            <UploadedResourceList
                data={recentNotes || []}
                renderItem={(item) => <RecentResourceCard item={item} />}
            />
        </ResourcePageStateHandler>
    )
}

export default MyRecentNotesPage;