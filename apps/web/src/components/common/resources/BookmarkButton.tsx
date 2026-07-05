"use client";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/ui/Button";
import { useMe, useBookmarkedResourceIds, useBookmarkResource, useUnbookmarkResource } from "@/hooks/queries/use-me";

interface BookmarkButtonProps {
    resourceId: number;
}

const BookmarkButton = ({ resourceId }: BookmarkButtonProps) => {
    const { data: userData } = useMe();
    const { data: bookmarkedIds } = useBookmarkedResourceIds();
    const { mutate: bookmark, isPending: isBookmarking } = useBookmarkResource();
    const { mutate: unbookmark, isPending: isUnbookmarking } = useUnbookmarkResource();

    // Bookmarking requires being signed in - guests never see the button at all,
    // rather than seeing a disabled/dead one.
    if (!userData) return null;

    const isBookmarked = !!bookmarkedIds?.includes(resourceId);

    const handleToggle = () => {
        const idAsString = String(resourceId);

        if (isBookmarked) {
            unbookmark(idAsString, {
                onSuccess: () => {
                    toast.success("Bookmark removed.");
                },
                onError: (error) => {
                    toast.error(error instanceof Error ? error.message : "Failed to remove bookmark.");
                },
            });
        } else {
            bookmark(idAsString, {
                onSuccess: () => {
                    toast.success("Resource bookmarked.");
                },
                onError: (error) => {
                    toast.error(error instanceof Error ? error.message : "Failed to bookmark resource.");
                },
            });
        }
    };

    return (
        <Button
            variant="ghost"
            size="xs"
            iconOnly
            icon={<Bookmark className="size-4" fill={isBookmarked ? "currentColor" : "none"} />}
            onClick={handleToggle}
            disabled={isBookmarking || isUnbookmarking}
            className={isBookmarked ? "text-info hover:text-info hover:bg-info/10" : "text-foreground-secondary hover:text-info hover:bg-info/10"}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark resource"}
        />
    );
};

export default BookmarkButton;
