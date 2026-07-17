import MarketplaceListingCard from "./MarketplaceListingCard";
import EditListingButton from "./EditListingButton";
import DeleteListingButton from "./DeleteListingButton";
import ListingStatusToggleButton from "./ListingStatusToggleButton";
import type { ListingSummary } from "@/types/api";
import { MarketplaceListingStatus, MarketplaceReportReasonLabel } from "@/types/entities";

interface MyListingCardProps {
    listing: ListingSummary;
}

// Only ever rendered on the poster's own "My Listings" page - every item shown is guaranteed to be theirs.
const MyListingCard = ({ listing }: MyListingCardProps) => {
    const showModerationNotice = listing.status === MarketplaceListingStatus.REMOVED;

    return (
        <div className="space-y-2">
            <MarketplaceListingCard
                listing={listing}
                actions={
                    <div className="flex items-center gap-2 shrink-0">
                        <ListingStatusToggleButton listingId={listing.id} status={listing.status} />
                        <EditListingButton listingId={listing.id} />
                        <DeleteListingButton listingId={listing.id} />
                    </div>
                }
            />

            {showModerationNotice && (
                <div className="rounded-lg border border-border bg-background-tertiary px-4 py-3 text-sm">
                    <p className="font-medium text-foreground">
                        This listing was removed
                        {listing.moderationReason && `: ${MarketplaceReportReasonLabel[listing.moderationReason]}`}
                    </p>
                    {listing.moderationNote && (
                        <p className="mt-1 text-foreground-secondary">{listing.moderationNote}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyListingCard;
