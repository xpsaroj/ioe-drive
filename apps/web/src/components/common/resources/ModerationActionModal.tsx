"use client";
import { useForm, Controller } from "react-hook-form";

import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { ModerationReason, ModerationReasonLabel } from "@/types/entities";

interface ModerationActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    submitLabel: string;
    isSubmitting: boolean;
    onSubmit: (data: { reason: ModerationReason; note?: string }) => void;
}

interface FormValues {
    reason: ModerationReason | "";
    note: string;
}

/**
 * Shared reason-dropdown + optional-note form, used for every action that needs one:
 * a moderator's reject/remove, and a visitor's report. All three take the same
 * `{ reason, note? }` shape on the backend (ModerateResourceDto/ReportResourceDto).
 */
const ModerationActionModal = ({
    isOpen,
    onClose,
    title,
    description,
    submitLabel,
    isSubmitting,
    onSubmit,
}: ModerationActionModalProps) => {
    const {
        handleSubmit,
        control,
        register,
        reset,
        formState: { errors },
    } = useForm<FormValues>({ defaultValues: { reason: "", note: "" } });

    const handleClose = () => {
        reset();
        onClose();
    };

    const submit = (data: FormValues) => {
        onSubmit({ reason: data.reason as ModerationReason, note: data.note.trim() || undefined });
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={title}>
            <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
                {description && <p className="text-sm text-foreground-secondary">{description}</p>}

                <Controller
                    control={control}
                    name="reason"
                    rules={{ required: "A reason is required" }}
                    render={({ field }) => (
                        <Select
                            label="Reason"
                            placeholder="Select a reason"
                            required
                            value={field.value}
                            error={errors.reason?.message}
                            disabled={isSubmitting}
                            onChange={field.onChange}
                            options={Object.values(ModerationReason).map((reason) => ({
                                value: reason,
                                label: ModerationReasonLabel[reason],
                            }))}
                        />
                    )}
                />

                <Textarea
                    label="Additional details"
                    placeholder="Optional context (not required)"
                    rows={3}
                    disabled={isSubmitting}
                    error={errors.note?.message}
                    {...register("note", {
                        maxLength: { value: 1000, message: "Must be at most 1000 characters" },
                    })}
                />

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : submitLabel}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ModerationActionModal;
