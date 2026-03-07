"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"

import { Semester, SemesterLabel } from "@/types"
import { usePrograms } from "@/hooks/queries/use-academics"
import { useMe } from "@/hooks/queries/use-me"
import { useUpdateProfile } from "@/hooks/queries/use-me"

import Select from "@/components/ui/Select"
import Button from "@/components/ui/Button"
import Loader from "@/components/ui/Loader"

type FormValues = {
    programId: string
    semester: Semester | ""
    college: string
}

const OnBoardingPage = () => {
    const router = useRouter()

    const { data: programs, isLoading: programsLoading } = usePrograms();

    const { data: userData, isLoading: userLoading, error } = useMe();
    const profile = userData ? userData?.profile : null;

    const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

    const {
        handleSubmit,
        control,
        register,
        setError,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            programId: "",
            semester: "",
            college: ""
        }
    })

    useEffect(() => {
        if (profile?.semester && profile?.programId) {
            router.push("/dashboard")
        }
    }, [profile?.semester, profile?.programId, router])


    const onSubmit = async (data: FormValues) => {
        if (!data.programId || !data.semester)
            return;

        if (programs?.find(p => p.id === Number(data.programId))?.code !== "BAR" && Number(data.semester) > 8) {
            setError("semester", {
                message: "Only students in the BAR program can select a semester beyond 8."
            })
            return;
        }

        try {
            await updateProfile({
                programId: Number(data.programId),
                semester: data.semester,
                college: data.college,
            });

            router.push("/dashboard")
        } catch {
            setError("root", {
                message: "Failed to update profile. Please try again."
            })
        }
    }

    if (programsLoading || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center">
                    <Loader text="Loading. Please wait." />
                </div>
            </div>
        )
    }

    if (error || !programs) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-red-500">Something went wrong. Please try again later.</p>
                    <div className="flex space-x-4">
                        <Button variant="secondary" className="mt-4" onClick={() => router.refresh()}>
                            Refresh Page
                        </Button>
                        <Button variant="primary" className="mt-4" onClick={() => router.back()}>
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
            <div className="w-full max-w-xl bg-card border rounded-xl md:p-8 p-6 shadow-sm">

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Complete your profile</h1>
                    <p className="text-foreground-secondary text-sm mt-1">
                        Add a few details to personalize your experience. You can skip this if you want.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <Controller
                        control={control}
                        name="programId"
                        rules={{
                            required: "Program is required"
                        }}
                        render={({ field }) => (
                            <Select
                                label="Program"
                                placeholder="Select program"
                                value={field.value}
                                error={errors.programId?.message}
                                onChange={field.onChange}
                                options={programs.map((prog) => ({
                                    value: String(prog.id),
                                    label: `${prog.code} - ${prog.name}`,
                                }))}
                                helperText="Select the program you are currently enrolled in."
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="semester"
                        rules={{
                            required: "Semester is required"
                        }}
                        render={({ field }) => (
                            <Select
                                label="Semester"
                                placeholder="Select semester"
                                value={field.value}
                                error={errors.semester?.message}
                                onChange={field.onChange}
                                options={Object.keys(SemesterLabel).map((sem) => ({
                                    value: String(sem),
                                    label: `${SemesterLabel[sem as Semester]} ${+sem > 8 ? "(Architecture)" : ""}`,
                                }))}
                                helperText="Select the semester you are currently in."
                            />
                        )}
                    />

                    <div>
                        <label className="block text-sm font-medium mb-1 text-foreground">
                            College
                        </label>
                        <input
                            {...register("college", {
                                required: "College name is required",
                                minLength: { value: 3, message: "College name must be at least 3 characters long" },
                                maxLength: { value: 50, message: "College name must be less than 50 characters long" }
                            })}
                            placeholder="XYZ Engineering College"
                            className={`w-full border ${errors.college ? "border-error bg-error/10" : "hover:border-input-placeholder  bg-background"} focus:ring-2 focus:ring-foreground focus:border-transparent outline-none rounded-lg px-3 py-2`}
                        />
                        {errors.college && (
                            <p className="mt-1.5 text-xs text-error">
                                {errors.college.message}
                            </p>
                        )}
                    </div>

                    {errors.root && (
                        <p className="mt-1.5 text-sm text-error">
                            {errors.root.message}
                        </p>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            disabled={isPending}
                            href="/dashboard"
                            variant="secondary"
                            className="flex-1"
                        >
                            Skip
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1"
                        >
                            {isPending ? "Saving..." : "Save & Continue"}
                        </Button>

                    </div>

                </form>
            </div>
        </div>
    )
}

export default OnBoardingPage