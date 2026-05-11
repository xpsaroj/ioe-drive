"use client"
import { UploadedResourceList, UploadedResourceCard, ResourcePageStateHandler } from "@/components/common/resources";
import { useUploadedNotes } from "@/hooks/queries/use-me";

const MyUploadedNotesPage = () => {
    const { data: uploadedNotes, isPending, error } = useUploadedNotes();

    return (
        <ResourcePageStateHandler
            title="My Uploaded Notes"
            isPending={isPending}
            error={error}
            isEmpty={!uploadedNotes || uploadedNotes.length === 0}
            loaderText="Loading uploaded notes. Please wait."
            emptyTitle="Oops. Looks like you haven't uploaded any notes yet."
            emptyDescription="Share resources (notes, books, past questions, etc.) to help your peers and juniors succeed in their studies. Once you upload notes, you'll be able to see them here."
            emptyButtonText="Share Resources"
            emptyButtonHref="/resources/share"
        >
            <UploadedResourceList
                data={uploadedNotes || []}
                renderItem={(item) => <UploadedResourceCard item={item} />}
            />
        </ResourcePageStateHandler>
    )
}

export default MyUploadedNotesPage;