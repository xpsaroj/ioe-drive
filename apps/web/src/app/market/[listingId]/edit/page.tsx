"use client"
import { use } from "react"
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { useListing } from "@/hooks/queries/use-marketplace";
import { useMe } from "@/hooks/queries/use-me";
import Button from "@/components/ui/Button";
import { PageStateHandler } from "@/components/layout";
import { ListingEditForm, ListingPhotosManager } from "@/components/common/marketplace";

interface ListingEditPageProps {
    params: Promise<{
        listingId: string;
    }>
}

const ListingEditPage = ({
    params
}: ListingEditPageProps) => {
    const { listingId: lId } = use(params);
    const listingId = Number(lId);

    const router = useRouter();

    const { data: listing, isPending, error } = useListing(listingId);
    const { data: userData, isPending: userPending } = useMe();

    const header = (
        <div className="flex items-center gap-2 mb-4">
            <Button
                icon={<ChevronLeft className="size-4" />}
                iconOnly
                variant="ghost"
                size="xs"
                className="border border-border"
                onClick={() => router.back()}
                aria-label="Go back"
            />
            <h3 className="text-xl md:text-2xl font-medium">Edit Listing</h3>
        </div>
    )

    const emptyContent = (
        <div className="flex flex-col justify-center items-center">
            <p className="text-4xl">404</p>
            <p className="text-foreground-secondary">The listing you are looking for does not exist.</p>
        </div>
    )

    const isMissing = !listingId || isNaN(listingId) || !listing;

    if (isMissing || isPending || userPending) {
        return (
            <PageStateHandler
                isPending={isPending || userPending}
                error={error}
                isEmpty={!isPending && !userPending && isMissing}
                header={header}
                loaderText="Loading listing details. Please wait."
                emptyContent={emptyContent}
            >
                {null}
            </PageStateHandler>
        );
    }

    const isOwner = !!userData && !!listing.postedBy && userData.id === listing.postedBy;

    if (!isOwner) {
        return (
            <div className="min-h-screen bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">
                {header}
                <div className="border rounded-lg flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <p className="text-lg font-medium">You can&apos;t edit this listing.</p>
                        <p className="text-foreground-secondary text-sm">
                            Only the person who posted a listing can edit it.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">
            {header}
            <ListingEditForm
                listing={listing}
                photosPanel={<ListingPhotosManager listing={listing} />}
            />
        </div>
    )
}

export default ListingEditPage;
