"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Check, ShieldOff, X } from "lucide-react";

import Button from "@/components/ui/Button";
import ModerationActionModal from "./ModerationActionModal";
import { useApproveResource, useRejectResource, useRemoveResource } from "@/hooks/queries/use-resources";
import { ResourceStatus } from "@/types/entities";
import type { ModerationReasonInput } from "@/lib/validators/resources";

interface ModeratorActionBarProps {
    resourceId: number;
    status: ResourceStatus;
}

/** Moderator-only Approve/Reject/Remove controls for the resource detail page - only
 * rendered by the page itself when the viewer's role is MODERATOR. Which actions show
 * up depends on the resource's current status: only PENDING can be approved, REMOVED
 * is terminal (no further action), everything else can still be rejected or removed. */
const ModeratorActionBar = ({ resourceId, status }: ModeratorActionBarProps) => {
    const [openModal, setOpenModal] = useState<"reject" | "remove" | null>(null);

    const { mutate: approve, isPending: isApproving } = useApproveResource(resourceId);
    const { mutate: reject, isPending: isRejecting } = useRejectResource(resourceId);
    const { mutate: remove, isPending: isRemoving } = useRemoveResource(resourceId);

    const canApprove = status === ResourceStatus.PENDING;
    const canReject = status === ResourceStatus.PENDING || status === ResourceStatus.APPROVED;
    const canRemove = status !== ResourceStatus.REMOVED;

    if (!canApprove && !canReject && !canRemove) return null;

    const handleApprove = () => {
        approve(undefined, {
            onSuccess: () => toast.success("Resource approved."),
            onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to approve resource."),
        });
    };

    const handleReject = (data: ModerationReasonInput) => {
        reject(data, {
            onSuccess: () => {
                toast.success("Resource rejected.");
                setOpenModal(null);
            },
            onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to reject resource."),
        });
    };

    const handleRemove = (data: ModerationReasonInput) => {
        remove(data, {
            onSuccess: () => {
                toast.success("Resource removed.");
                setOpenModal(null);
            },
            onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to remove resource."),
        });
    };

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
                Moderator Actions
            </p>

            <div className="flex flex-wrap items-center gap-2">
                {canApprove && (
                    <Button size="sm" icon={<Check className="size-4" />} onClick={handleApprove} disabled={isApproving}>
                        {isApproving ? "Approving..." : "Approve"}
                    </Button>
                )}

                {canReject && (
                    <Button
                        size="sm"
                        variant="secondary"
                        icon={<X className="size-4" />}
                        onClick={() => setOpenModal("reject")}
                    >
                        Reject
                    </Button>
                )}

                {canRemove && (
                    <Button
                        size="sm"
                        variant="destructive"
                        icon={<ShieldOff className="size-4" />}
                        onClick={() => setOpenModal("remove")}
                    >
                        Remove
                    </Button>
                )}
            </div>

            <ModerationActionModal
                isOpen={openModal === "reject"}
                onClose={() => setOpenModal(null)}
                title="Reject Resource"
                description="This sends the resource back to its uploader along with your reason - they can edit and resubmit it for another review."
                submitLabel="Reject"
                isSubmitting={isRejecting}
                onSubmit={handleReject}
            />

            <ModerationActionModal
                isOpen={openModal === "remove"}
                onClose={() => setOpenModal(null)}
                title="Remove Resource"
                description="This permanently deletes the resource's files and can't be undone or resubmitted. The uploader will see your reason on their own uploads page."
                submitLabel="Remove"
                isSubmitting={isRemoving}
                onSubmit={handleRemove}
            />
        </div>
    );
};

export default ModeratorActionBar;
