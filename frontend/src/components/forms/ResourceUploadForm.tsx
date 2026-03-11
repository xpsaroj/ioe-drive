"use client";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { CloudUpload } from "lucide-react";

import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { ContainerBox } from "@/components/ui/ContainerBox";
import { usePrograms, useSubjectsForUpload } from "@/hooks/queries/use-academics";
import { useCreateNote } from "@/hooks/queries/use-notes";
import { Semester, Year, SemesterLabel, YearLabel } from "@/types";

type FormValues = {
    title: string;
    description: string;
    programId: string;
    type: string;
    year: Year | "";
    semester: Semester | "";
    subjectId: string;
    file: File | null;
};

export const ResourceUploadForm: React.FC = () => {
    const router = useRouter();

    const { data: programs, isPending: programsPending, error: programsLoadError } = usePrograms();
    const {
        mutate,
        isPending: isUploading,
        error: uploadError,
        isSuccess: uploadSuccess,
    } = useCreateNote();

    const {
        handleSubmit,
        control,
        register,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            title: "",
            description: "",
            programId: "",
            type: "",
            year: "",
            semester: "",
            subjectId: "",
            file: null,
        },
    });

    const file = watch("file");
    const selectedProgramId = watch("programId");
    const selectedYear = watch("year");
    const selectedSemester = watch("semester");

    const {
        data: subjects,
        isFetching: subjectsFetching,
    } = useSubjectsForUpload(
        selectedProgramId ? Number(selectedProgramId) : undefined,
        selectedYear || undefined,
        selectedSemester || undefined,
    );

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) setValue("file", dropped, { shouldValidate: true });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) setValue("file", selected, { shouldValidate: true });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const onSubmit = (data: FormValues) => {
        if (!data.file) return;
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("subjectId", data.subjectId);
        formData.append("noteFile", data.file);
        mutate(formData, {
            onSuccess: () => {
                reset()
                const fileInput = document.getElementById("fileInput") as HTMLInputElement;
                if (fileInput) fileInput.value = "";
            },
        });
    };

    if (programsPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="flex flex-col items-center justify-center">
                    <Loader text="Loading. Please wait." />
                </div>
            </div>
        );
    }

    if (programsLoadError || !programs) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-red-500">Something went wrong. Please try again later.</p>
                    <div className="flex space-x-4">
                        <Button variant="primary" className="mt-4" onClick={() => router.back()}>
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const allThreeSelected = !!(selectedProgramId && selectedYear && selectedSemester);

    return (
        <ContainerBox
            title="Upload Notes"
            comment="Make sure to keep the resource name relevant to the file you are uploading."
            className="bg-background-secondary mx-auto p-8"
        >
            <div
                className="border-2 p-4 text-center mb-8 rounded-lg cursor-pointer hover:border-foreground transition duration-150"
                onDragOver={handleDragOver}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById("fileInput")?.click()}
            >
                <CloudUpload className="w-12 h-12 text-foreground mx-auto mb-3" />
                {file ? (
                    <p className="text-md text-foreground">{file.name}</p>
                ) : (
                    <p className="text-md text-foreground-secondary">
                        Drag and drop files here or click to add from computer.
                    </p>
                )}
                <input
                    id="fileInput"
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:gap-6">
                    {/* Title */}
                    <Input
                        label="Resource Title"
                        placeholder="Electromagnetics Book"
                        error={errors.title?.message}
                        disabled={isUploading}
                        {...register("title", {
                            required: "Resource title is required",
                            minLength: { value: 3, message: "Title must be at least 3 characters" },
                            maxLength: { value: 100, message: "Title must be less than 100 characters" },
                        })}
                    />

                    {/* Description */}
                    <Input
                        label="Description"
                        placeholder="An awesome book on electromagnetics"
                        error={errors.description?.message}
                        disabled={isUploading}
                        {...register("description", {
                            required: "Resource description is required",
                            minLength: { value: 10, message: "Description must be at least 10 characters" },
                            maxLength: { value: 200, message: "Description must be less than 200 characters" },
                        })}
                    />
                </div>

                <div className="flex flex-col md:flex-row md:gap-6">
                    {/* Program */}
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
                                disabled={isUploading}
                                onChange={(e) => {
                                    field.onChange(e);
                                    setValue("year", "");
                                    setValue("semester", "");
                                    setValue("subjectId", "");
                                }}
                                options={programs.map((prog) => ({
                                    value: String(prog.id),
                                    label: `${prog.code} - ${prog.name}`,
                                }))}
                                helperText="Select the program to which you want the note be uploaded to."
                            />
                        )}
                    />

                    {/* Resource Type */}
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
                                disabled={isUploading}
                                onChange={field.onChange}
                                options={["Notes", "Past Question", "Book"].map((type) => ({
                                    value: type,
                                    label: type,
                                }))}
                                helperText="The type of the resource (notes, past question, book)."
                            />
                        )}
                    />
                </div>

                <div className="flex flex-col md:flex-row md:gap-6">
                    {/* Year */}
                    <Controller
                        control={control}
                        name="year"
                        rules={{ required: "Year is required" }}
                        render={({ field }) => (
                            <Select
                                label="Year"
                                placeholder="Select Year"
                                value={field.value}
                                error={errors.year?.message}
                                disabled={!selectedProgramId || isUploading}
                                onChange={(e) => {
                                    field.onChange(e);
                                    setValue("semester", "");
                                    setValue("subjectId", "");
                                }}
                                options={Object.keys(YearLabel).map((year) => ({
                                    value: year,
                                    label: YearLabel[year as Year],
                                }))}
                                helperText="Select the year to which the resource belongs."
                            />
                        )}
                    />

                    {/* Semester */}
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
                                disabled={!selectedProgramId || !selectedYear || isUploading}
                                onChange={(e) => {
                                    field.onChange(e);
                                    setValue("subjectId", "");
                                }}
                                options={Object.keys(SemesterLabel).map((sem) => ({
                                    value: sem,
                                    label: `${SemesterLabel[sem as Semester]} ${+sem > 8 ? "(Architecture)" : ""}`,
                                }))}
                                helperText="Select the semester on which the subject is taught."
                            />
                        )}
                    />
                </div>

                <div className="flex flex-col md:flex-row md:gap-6">
                    {/* Subject */}
                    <Controller
                        control={control}
                        name="subjectId"
                        rules={{ required: "Subject is required" }}
                        render={({ field }) => (
                            <Select
                                label="Subject"
                                placeholder={
                                    !allThreeSelected
                                        ? "Select program, year and semester first"
                                        : subjectsFetching
                                            ? "Loading subjects..."
                                            : "Select Subject"
                                }
                                value={field.value}
                                error={errors.subjectId?.message}
                                disabled={!allThreeSelected || subjectsFetching || isUploading}
                                onChange={field.onChange}
                                options={
                                    subjects?.map((offering) => ({
                                        value: String(offering.subject.id),
                                        label: `${offering.subject.code} - ${offering.subject.name}${offering.isElective ? " (Elective)" : ""}`,
                                    })) ?? []
                                }
                                helperText="Select the subject to which the resource belongs."
                            />
                        )}
                    />
                </div>

                {uploadError && (
                    <p className="text-sm text-error">
                        Something went wrong. Please try again.
                    </p>
                )}

                {uploadSuccess && (
                    <p className="text-sm text-success">
                        Resource uploaded successfully! Thank you for contributing.
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={isUploading}
                    icon={<CloudUpload className="size-6" />}
                >
                    <span>{isUploading ? "UPLOADING..." : "UPLOAD"}</span>
                </Button>
            </form>

            <div className="relative w-full flex justify-center pt-4">
                <Button
                    variant="secondary"
                    href="/dashboard"
                    className="absolute -bottom-13"
                    disabled={isUploading}
                >
                    Back to Dashboard
                </Button>
            </div>
        </ContainerBox>
    );
};