"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Flag } from "lucide-react";

import Button from "@/components/ui/Button";
import ModerationActionModal from "./ModerationActionModal";
import { useReportResource } from "@/hooks/queries/use-resources";
import type { ModerationReasonInput } from "@/lib/validators/resources";

interface ReportResourceButtonProps {
    resourceId: number;
}

/** Lets any signed-in visitor other than the uploader flag an approved resource for
 * review - reporting doesn't hide it, it stays live until a moderator acts. Rendered
 * as a self-contained bar (matching ModeratorActionBar's visual style) rather than a
 * bare button, since the two are mutually exclusive - a viewer sees exactly one of
 * them in the same spot on the page, never both. */
const ReportResourceButton = ({ resourceId }: ReportResourceButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate, isPending } = useReportResource(resourceId);

    const handleSubmit = (data: ModerationReasonInput) => {
        mutate(data, {
            onSuccess: () => {
                toast.success("Thanks - we've received your report.");
                setIsOpen(false);
            },
            onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to report resource."),
        });
    };

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground-secondary">
                Found something misleading or inappropriate about this resource?
            </p>
            <Button
                variant="secondary"
                size="sm"
                icon={<Flag className="size-4" />}
                onClick={() => setIsOpen(true)}
                className="shrink-0"
            >
                Report
            </Button>

            <ModerationActionModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Report Resource"
                description="Let a moderator know what's wrong with this resource. Your identity isn't shared with its uploader."
                submitLabel="Submit Report"
                isSubmitting={isPending}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default ReportResourceButton;
