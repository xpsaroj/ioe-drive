"use client"
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { UploadedResourceList, ArchivedResourceCard } from "@/components/common/resources";
import { useArchivedNotes } from "@/hooks/queries/use-me";

const MyBookmarkedNotesPage = () => {
    const { data: archivedNotes, isPending, error } = useArchivedNotes();

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center">
                    <Loader text="Loading archived notes. Please wait." />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <p className="text-red-500">Something went wrong. Please try again later.</p>
            </div>
        )
    }


    if (!archivedNotes || archivedNotes.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <h3 className="text-xl md:text-2xl font-medium mb-4">My Archived Notes</h3>
                <div className="min-h-[85vh] flex flex-col items-center justify-center border gap-1 rounded-lg">
                    <p className="">
                        Oops. Looks like you haven&apos;t archived any notes yet.
                    </p>
                    <p className="text-sm text-foreground-secondary pb-1 md:max-w-xl text-center">
                        Click the bookmark icon on notes to save them for later. Once you archive notes, you&apos;ll be able to see them here.
                    </p>
                    <Button
                        href="/resources/current"
                    >
                        Explore Current Semester Notes
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
            <h3 className="text-xl md:text-2xl font-medium mb-4">My Archived Notes</h3>

            <UploadedResourceList
                data={archivedNotes || []}
                loading={isPending}
                error={error}
                emptyMessage="You haven't archived any notes yet."
                renderItem={(item) => <ArchivedResourceCard item={item} />}
            />

        </div>
    )
}

export default MyBookmarkedNotesPage;