"use client"
import { UploadedResourceList, ArchivedResourceCard, ResourcePageStateHandler } from "@/components/common/resources";
import { useArchivedNotes } from "@/hooks/queries/use-me";

const MyBookmarkedNotesPage = () => {
    const { data: archivedNotes, isPending, error } = useArchivedNotes();

    return (
        <ResourcePageStateHandler
            title="My Archived Notes"
            isPending={isPending}
            error={error}
            isEmpty={!archivedNotes || archivedNotes.length === 0}
            loaderText="Loading archived notes. Please wait."
            emptyTitle="Oops. Looks like you haven't archived any notes yet."
            emptyDescription="Click the bookmark icon on notes to save them for later. Once you archive notes, you'll be able to see them here."
            emptyButtonText="Explore Current Semester Notes"
            emptyButtonHref="/resources/current"
        >
            <UploadedResourceList
                data={archivedNotes || []}
                renderItem={(item) => <ArchivedResourceCard item={item} />}
            />
        </ResourcePageStateHandler>
    )
}

export default MyBookmarkedNotesPage;