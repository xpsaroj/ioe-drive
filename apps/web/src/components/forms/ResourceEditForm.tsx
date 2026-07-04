"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";

import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { usePrograms, useSubjectsForUpload, useSubjectDetails } from "@/hooks/queries/use-academics";
import { useUpdateResource } from "@/hooks/queries/use-resources";
import { Semester, SemesterLabel, ResourceType, ResourceTypeLabel } from "@/types/entities";
import type { ResourceSummary } from "@/types/api";

interface ResourceEditFormProps {
    resource: ResourceSummary;
}

type FormValues = {
    title: string;
    description: string;
    programId: string;
    type: ResourceType | "";
    semester: Semester | "";
    offeringId: string;
};

/**
 * Edit form for a resource the current user owns. Prefills the Program/Semester/
 * Subject selects from the resource's current subject offering (fetched via
 * useSubjectDetails, since ResourceSummary only carries the offering's id/subject -
 * not the program/semester needed to seed the cascading selects).
 */
export const ResourceEditForm = ({ resource }: ResourceEditFormProps) => {
    const router = useRouter();

    const { data: offeringDetails, isPending: offeringPending } = useSubjectDetails(resource.offeringId);
    const { data: programs, isPending: programsPending } = usePrograms();
    const { mutate, isPending: isSaving } = useUpdateResource(resource.id);

    const {
        handleSubmit,
        control,
        register,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            title: resource.title,
            description: resource.description,
            programId: "",
            type: resource.type,
            semester: "",
            offeringId: "",
        },
    });

    // Seed Program/Semester/Subject once the current offering's details have loaded -
    // they aren't known until then, so the cascading selects start out empty.
    useEffect(() => {
        if (!offeringDetails) return;

        reset({
            title: resource.title,
            description: resource.description,
            programId: String(offeringDetails.programId),
            type: resource.type,
            semester: offeringDetails.semester,
            offeringId: String(resource.offeringId),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offeringDetails]);

    const selectedProgramId = useWatch({ control, name: "programId" });
    const selectedSemester = useWatch({ control, name: "semester" });

    const { data: subjects, isFetching: subjectsFetching } = useSubjectsForUpload(
        selectedProgramId ? Number(selectedProgramId) : undefined,
        selectedSemester || undefined,
    );

    const bothSelected = !!(selectedProgramId && selectedSemester);

    const onSubmit = (data: FormValues) => {
        mutate(
            {
                title: data.title,
                description: data.description,
                type: data.type as ResourceType,
                offeringId: Number(data.offeringId),
            },
            {
                onSuccess: () => {
                    toast.success("Resource updated successfully.");
                    router.back();
                },
                onError: (error) => {
                    toast.error(error instanceof Error ? error.message : "Failed to update resource.");
                },
            }
        );
    };

    const isLoadingInitialData = offeringPending || programsPending || !programs;

    if (isLoadingInitialData) {
        return <Loader text="Loading resource details..." />;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <Input
                    label="Resource Title"
                    error={errors.title?.message}
                    disabled={isSaving}
                    {...register("title", {
                        required: "Resource title is required",
                        minLength: { value: 3, message: "Title must be at least 3 characters" },
                        maxLength: { value: 100, message: "Title must be less than 100 characters" },
                    })}
                />

                <Input
                    label="Description"
                    error={errors.description?.message}
                    disabled={isSaving}
                    {...register("description", {
                        required: "Resource description is required",
                        minLength: { value: 10, message: "Description must be at least 10 characters" },
                        maxLength: { value: 200, message: "Description must be less than 200 characters" },
                    })}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <Controller
                    control={control}
                    name="programId"
                    rules={{ required: "Program is required" }}
                    render={({ field }) => (
                        <Select
                            label="Program"
                            placeholder="Select Program"
                            value={field.value}
                            error={errors.programId?.message}
                            disabled={isSaving}
                            onChange={(e) => {
                                field.onChange(e);
                                setValue("semester", "");
                                setValue("offeringId", "");
                            }}
                            options={programs.map((prog) => ({
                                value: String(prog.id),
                                label: `${prog.code} - ${prog.name}`,
                            }))}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="type"
                    rules={{ required: "Resource type is required" }}
                    render={({ field }) => (
                        <Select
                            label="Resource Type"
                            placeholder="Select Resource Type"
                            value={field.value}
                            error={errors.type?.message}
                            disabled={isSaving}
                            onChange={field.onChange}
                            options={Object.values(ResourceType).map((type) => ({
                                value: type,
                                label: ResourceTypeLabel[type],
                            }))}
                        />
                    )}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <Controller
                    control={control}
                    name="semester"
                    rules={{ required: "Semester is required" }}
                    render={({ field }) => (
                        <Select
                            label="Semester"
                            placeholder="Select Semester"
                            value={field.value}
                            error={errors.semester?.message}
                            disabled={!selectedProgramId || isSaving}
                            onChange={(e) => {
                                field.onChange(e);
                                setValue("offeringId", "");
                            }}
                            options={Object.keys(SemesterLabel).map((sem) => ({
                                value: sem,
                                label: `${SemesterLabel[sem as Semester]} ${+sem > 8 ? "(Architecture)" : ""}`,
                            }))}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="offeringId"
                    rules={{ required: "Subject is required" }}
                    render={({ field }) => (
                        <Select
                            label="Subject"
                            placeholder={
                                !bothSelected
                                    ? "Select program and semester first"
                                    : subjectsFetching
                                        ? "Loading subjects..."
                                        : "Select Subject"
                            }
                            value={field.value}
                            error={errors.offeringId?.message}
                            disabled={!bothSelected || subjectsFetching || isSaving}
                            onChange={field.onChange}
                            options={
                                subjects?.map((offering) => ({
                                    value: String(offering.id),
                                    label: `${offering.subject.code} - ${offering.subject.name}${offering.isElective ? " (Elective)" : ""}`,
                                })) ?? []
                            }
                        />
                    )}
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => router.back()} disabled={isSaving}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
};
