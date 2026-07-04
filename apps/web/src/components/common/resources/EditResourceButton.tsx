import { Pencil } from "lucide-react";

import Button from "@/components/ui/Button";
import type { ResourceSummary } from "@/types/api";

interface EditResourceButtonProps {
    resource: ResourceSummary;
}

const EditResourceButton = ({ resource }: EditResourceButtonProps) => {
    return (
        <Button
            href={`/resources/r/${resource.id}/edit`}
            variant="ghost"
            size="xs"
            iconOnly
            icon={<Pencil className="size-4" />}
            className="text-foreground-secondary hover:text-info hover:bg-info/10"
            aria-label="Edit resource"
        />
    );
};

export default EditResourceButton;
