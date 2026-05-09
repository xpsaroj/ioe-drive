"use client"
import { ChevronLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { UploadedResourceList, RecentResourceCard } from "@/components/common/resources";
import { useRecentNotes } from "@/hooks/queries/use-me";

const MyRecentNotesPage = () => {
    const { data: recentNotes, isPending, error } = useRecentNotes();

    if (isPending) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        icon={<ChevronLeft className="size-4" />}
                        iconOnly
                        href="/resources"
                        variant="ghost"
                        size="xs"
                        className="border border-border"
                    />
                    <h3 className="text-xl md:text-2xl font-medium">My Recent Notes</h3>
                </div>
                <div className="flex-1 flex items-center justify-center border rounded-lg">
                    <Loader text="Loading recent notes. Please wait." />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        icon={<ChevronLeft className="size-4" />}
                        iconOnly
                        href="/resources"
                        variant="ghost"
                        size="xs"
                        className="border border-border"
                    />
                    <h3 className="text-xl md:text-2xl font-medium">My Recent Notes</h3>
                </div>
                <div className="flex-1 flex items-center justify-center border rounded-lg">
                    <p className="text-red-500">Something went wrong. Please try again later.</p>
                </div>
            </div>
        )
    }

    if (!recentNotes || recentNotes.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        icon={<ChevronLeft className="size-4" />}
                        iconOnly
                        href="/resources"
                        variant="ghost"
                        size="xs"
                        className="border border-border"
                    />
                    <h3 className="text-xl md:text-2xl font-medium">My Recent Notes</h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center border gap-1 rounded-lg">
                    <p className="">
                        Oops. Looks like you haven&apos;t viewed any notes recently.
                    </p>
                    <p className="text-sm text-foreground-secondary pb-1 md:max-w-xl text-center">
                        Start exploring notes for your subjects to see them here.
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
            <div className="flex items-center gap-2 mb-4">
                <Button
                    icon={<ChevronLeft className="size-4" />}
                    iconOnly
                    href="/resources"
                    variant="ghost"
                    size="xs"
                    className="border border-border"
                />
                <h3 className="text-xl md:text-2xl font-medium">My Recent Notes</h3>
            </div>

            <UploadedResourceList
                data={recentNotes || []}
                loading={isPending}
                error={error}
                emptyMessage="You haven't viewed any notes yet."
                renderItem={(item) => <RecentResourceCard item={item} />}
            />

        </div>
    )
}

export default MyRecentNotesPage;