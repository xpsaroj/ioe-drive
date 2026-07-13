"use client"
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ListChecks } from "lucide-react";

import { SubjectHardnessBadge } from "@/components/common/offering";
import { BookSpines, DEFAULT_SHELF_SPINES } from "@/components/decor";
import Select from "@/components/ui/Select";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@clerk/nextjs";
import { useMe } from "@/hooks/queries/use-me";
import { usePrograms, useSubjectOfferings } from "@/hooks/queries/use-academics";
import { Semester, SemesterLabel } from "@/types/entities";

const OfferingsBrowseContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { isLoaded: authLoaded, isSignedIn } = useAuth();
    const { data: userData, isPending: profilePending } = useMe();
    const profile = userData?.profile;

    const { data: programs, isPending: programsPending } = usePrograms();

    const urlProgramId = searchParams.get("programId");
    const urlSemester = searchParams.get("semester") as Semester | null;

    const programId = urlProgramId ? Number(urlProgramId) : undefined;
    const semester = urlSemester || undefined;

    const profileHasDefault = !!(profile?.programId && profile?.semester);
    const waitingForProfileDefault = !!isSignedIn && (!authLoaded || profilePending);
    // If we're signed in with a complete profile but the URL doesn't reflect it yet,
    // we're about to auto-redirect below - keep showing a loading state instead of
    // briefly flashing the "select a program and semester" prompt.
    const pendingAutoRedirect = !!isSignedIn && !profilePending && profileHasDefault && !urlProgramId && !urlSemester;

    // Default the filter from the signed-in user's profile the first time they land here
    // with no explicit selection in the URL.
    useEffect(() => {
        if (urlProgramId || urlSemester) return;
        if (!isSignedIn || profilePending) return;
        if (profile?.programId && profile?.semester) {
            const params = new URLSearchParams();
            params.set("programId", String(profile.programId));
            params.set("semester", profile.semester);
            router.replace(`/offerings?${params.toString()}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignedIn, profilePending, profile?.programId, profile?.semester, urlProgramId, urlSemester]);

    const { data: subjectOfferings, error: offeringsError, isPending: offeringsPending } = useSubjectOfferings(programId, semester);
    const hasOfferings = !!subjectOfferings && subjectOfferings.length > 0;

    const updateFilter = (next: { programId?: string; semester?: string }) => {
        const params = new URLSearchParams(searchParams.toString());

        if (next.programId !== undefined) {
            if (next.programId) params.set("programId", next.programId);
            else params.delete("programId");
        }

        if (next.semester !== undefined) {
            if (next.semester) params.set("semester", next.semester);
            else params.delete("semester");
        }

        router.replace(`/offerings?${params.toString()}`);
    };

    const pageHeader = (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-background-secondary p-6 md:p-8">
            <BookSpines spines={DEFAULT_SHELF_SPINES} />

            <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-md">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Curriculum Directory</h1>
                    <p className="mt-1 text-foreground-secondary">
                        Filter by program and semester to find specific subject details.
                    </p>
                </div>
                {hasOfferings && (
                    <div className="flex shrink-0 items-center gap-2 self-start rounded-lg border border-border bg-background px-3 py-2">
                        <ListChecks className="size-4 text-foreground-tertiary" />
                        <p className="font-display text-xs uppercase tracking-wide text-foreground-secondary">
                            Subjects: <span className="font-semibold text-foreground">{subjectOfferings.length}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    const filterBar = (
        <div className="flex flex-col border-b sm:flex-row">
            <div className="flex-1 p-4">
                <Select
                    label="Program"
                    placeholder="Select Program"
                    helperText={programsPending ? "Loading programs..." : "Select your department"}
                    value={programId ? String(programId) : ""}
                    disabled={programsPending}
                    onChange={(e) => updateFilter({ programId: e.target.value })}
                    options={(programs ?? []).map((prog) => ({
                        value: String(prog.id),
                        label: `${prog.code} - ${prog.name}`,
                    }))}
                />
            </div>

            <div className="flex-1 p-4">
                <Select
                    label="Semester"
                    placeholder="Select Semester"
                    helperText={programId ? "Choose your term" : "Select a program first"}
                    value={semester ?? ""}
                    onChange={(e) => updateFilter({ semester: e.target.value })}
                    options={Object.keys(SemesterLabel).map((sem) => ({
                        value: sem,
                        label: `${SemesterLabel[sem as Semester]} ${+sem > 8 ? "(Architecture)" : ""}`,
                    }))}
                />
            </div>
        </div>
    );

    if (waitingForProfileDefault || pendingAutoRedirect) {
        return (
            <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto md:px-8 px-6 md:space-y-8 space-y-6">
                <div className="pt-6 md:pt-8">
                    {pageHeader}
                    <div className="mt-6">{filterBar}</div>
                </div>
                <div className="flex-1 flex items-center justify-center py-16">
                    <Loader text="Loading your subject offerings. Please wait." />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto md:px-8 px-6 md:space-y-8 space-y-6">
            <div className="pt-6 md:pt-8">
                {pageHeader}
                <div className="mt-6">{filterBar}</div>
                {isSignedIn && authLoaded && !profilePending && !profileHasDefault && (
                    <p className="text-xs text-foreground-tertiary mt-2">
                        Tip: set your program and semester in your{" "}
                        <Link href="/profile" className="underline hover:text-foreground">
                            profile
                        </Link>{" "}
                        to see your current semester here by default.
                    </p>
                )}
            </div>

            {!programId || !semester ? (
                <div className="flex-1 border border-border flex items-center justify-center rounded-lg py-16">
                    <p className="text-sm text-foreground-secondary">
                        Select a program and semester above to browse subject offerings.
                    </p>
                </div>
            ) : offeringsPending ? (
                <div className="flex-1 flex items-center justify-center py-16">
                    <Loader text="Loading subject offerings. Please wait." />
                </div>
            ) : offeringsError ? (
                <div className="flex-1 flex items-center justify-center py-16">
                    <p className="text-error">Something went wrong. Please try again later.</p>
                </div>
            ) : !hasOfferings ? (
                <div className="flex-1 border border-border flex items-center justify-center rounded-lg py-16">
                    <p className="text-sm text-foreground-secondary">
                        No subjects offered for this program and semester.
                    </p>
                </div>
            ) : (
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mb-8">
                    {subjectOfferings.map((offering) => (
                        <Link
                            key={offering.id}
                            href={`/offerings/${offering.id}`}
                            className="group flex flex-col rounded-xl border border-border bg-card-background p-5 transition-colors hover:border-foreground-tertiary hover:bg-card-hover"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <span className="rounded-md border border-border px-2 py-1 font-display text-xs uppercase tracking-wide text-foreground-tertiary">
                                    {offering.subject.code}
                                </span>
                                <SubjectHardnessBadge level={offering.subject.hardnessLevel} dot className="shrink-0" />
                            </div>

                            <p className="mt-3 font-semibold text-foreground">{offering.subject.name}</p>

                            {offering.subject.description ? (
                                <p className="mt-1 line-clamp-2 text-sm text-foreground-secondary">
                                    {offering.subject.description}
                                </p>
                            ) : (
                                <p className="mt-1 text-sm italic text-foreground-tertiary">
                                    No description available yet.
                                </p>
                            )}

                            <div className="mt-4 flex items-center justify-end border-t border-border pt-3">
                                <ArrowRight className="size-4 text-foreground-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

const OfferingsPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <Loader text="Loading subject offerings. Please wait." />
            </div>
        }>
            <OfferingsBrowseContent />
        </Suspense>
    );
}

export default OfferingsPage;
