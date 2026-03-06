"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { selectPrograms } from "@/lib/store/features/academics/academics.selectors"
import { selectMyProfile } from "@/lib/store/features/me/me.selectors"
import { Semester, SemesterLabel } from "@/types"
import { updateMyProfile } from "@/lib/store/features/me/me.thunks"

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
    const dispatch = useAppDispatch()

    const programsState = useAppSelector(selectPrograms)
    const programs = programsState.data

    const userData = useAppSelector(selectMyProfile);
    const profile = userData ? userData?.data?.profile : null;

    const {
        handleSubmit,
        control,
        register,
        setError,
        formState: { isSubmitting, errors }
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

        if (programs.find(p => p.id === Number(data.programId))?.code !== "BAR" && Number(data.semester) > 8) {
            setError("semester", {
                message: "Only students in the BAR program can select a semester beyond 8."
            })
            return;
        }

        try {
            await dispatch(updateMyProfile({
                programId: Number(data.programId),
                semester: data.semester,
                college: data.college
            })).unwrap();

            router.push("/dashboard")
        } catch {
            setError("root", {
                message: "Failed to update profile. Please try again."
            })
        }
    }

    if (programsState.loading || userData.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center">
                    <Loader text="Loading. Please wait." />
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
                            disabled={isSubmitting}
                            href="/dashboard"
                            variant="secondary"
                            className="flex-1"
                        >
                            Skip
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? "Saving..." : "Save & Continue"}
                        </Button>

                    </div>

                </form>
            </div>
        </div>
    )
}

export default OnBoardingPage