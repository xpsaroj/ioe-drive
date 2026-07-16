"use client"
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import Button from "@/components/ui/Button";
import { ListingUploadForm } from "@/components/common/marketplace";

const CreateListingPage = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto space-y-6 md:space-y-8">
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
                <h3 className="text-xl md:text-2xl font-medium">Post a Listing</h3>
            </div>

            <ListingUploadForm />
        </div>
    );
};

export default CreateListingPage;
