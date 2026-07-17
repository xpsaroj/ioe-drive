import { Pencil } from "lucide-react";

import Button from "@/components/ui/Button";

interface EditListingButtonProps {
    listingId: number;
}

const EditListingButton = ({ listingId }: EditListingButtonProps) => {
    return (
        <Button
            href={`/market/${listingId}/edit`}
            variant="ghost"
            size="xs"
            iconOnly
            icon={<Pencil className="size-4" />}
            className="text-foreground-secondary hover:text-info hover:bg-info/10"
            aria-label="Edit listing"
        />
    );
};

export default EditListingButton;
