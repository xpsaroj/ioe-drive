"use client";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldOff } from "lucide-react";

import Button from "@/components/ui/Button";
import { ModerationActionModal } from "@/components/common/resources";
import { useRemoveListingAsModerator } from "@/hooks/queries/use-marketplace";
import { MarketplaceListingStatus, MarketplaceReportReason, MarketplaceReportReasonLabel } from "@/types/entities";
import type { MarketplaceReportReasonInput } from "@/lib/validators/marketplace";

const REASON_OPTIONS = Object.values(MarketplaceReportReason).map((reason) => ({
    value: reason,
    label: MarketplaceReportReasonLabel[reason],
}));

interface ListingModeratorActionBarProps {
    listingId: number;
    status: MarketplaceListingStatus;
}

// Marketplace has no pre-review queue, unlike resources - Remove is the only moderator action here.
const ListingModeratorActionBar = ({ listingId, status }: ListingModeratorActionBarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate, isPending } = useRemoveListingAsModerator(listingId);

    if (status === MarketplaceListingStatus.REMOVED) return null;

    const handleRemove = (data: { reason: string; note?: string }) => {
        mutate(data as MarketplaceReportReasonInput, {
            onSuccess: () => {
                toast.success("Listing removed.");
                setIsOpen(false);
            },
            onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to remove listing."),
        });
    };

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
                Moderator Actions
            </p>

            <Button
                size="sm"
                variant="destructive"
                icon={<ShieldOff className="size-4" />}
                onClick={() => setIsOpen(true)}
            >
                Remove
            </Button>

            <ModerationActionModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Remove Listing"
                description="This permanently deletes the listing's photos and can't be undone. The poster will see your reason on their own listings page."
                submitLabel="Remove"
                isSubmitting={isPending}
                reasonOptions={REASON_OPTIONS}
                onSubmit={handleRemove}
            />
        </div>
    );
};

export default ListingModeratorActionBar;
