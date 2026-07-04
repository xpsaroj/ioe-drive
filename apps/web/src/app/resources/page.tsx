"use client"
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";

import { SubjectDetails } from "@/components/common/offering";
import { SubjectTabs, ResourceList, ResourceCard } from "@/components/common/resources";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@clerk/nextjs";
import { useMe } from "@/hooks/queries/use-me";
import { usePrograms, useSubjectOfferings } from "@/hooks/queries/use-academics";
import { useResourcesBySubjectOfferingId } from "@/hooks/queries/use-resources";
import { Semester, SemesterLabel, SubjectOfferingWithSubject } from "@/types/entities";

const ResourcesBrowseContent = () => {
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
            router.replace(`/resources?${params.toString()}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignedIn, profilePending, profile?.programId, profile?.semester, urlProgramId, urlSemester]);

    const [selectedSubject, setSelectedSubject] = useState<SubjectOfferingWithSubject | null>(null);
    const [showSubjectDetails, setShowSubjectDetails] = useState(false);

    // Reset the in-page subject-tab selection whenever the program/semester filter changes
    useEffect(() => {
        setSelectedSubject(null);
        setShowSubjectDetails(false);
    }, [programId, semester]);

    const { data: subjectOfferings, error: offeringsError, isPending: offeringsPending } = useSubjectOfferings(programId, semester);

    const currentSubject = selectedSubject?.subject ?? subjectOfferings?.[0]?.subject;
    const { data: resources, isLoading: resourcesLoading, error: resourcesError } = useResourcesBySubjectOfferingId(selectedSubject?.id ?? subjectOfferings?.[0]?.id);

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

        router.replace(`/resources?${params.toString()}`);
    };

    const hasOfferings = !!subjectOfferings && subjectOfferings.length > 0;

    const filterBar = (
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div className="w-full sm:max-w-72">
                <Select
                    label="Program"
                    placeholder="Select Program"
                    helperText={programsPending ? "Loading programs..." : "Select a program you want resources for."}
                    value={programId ? String(programId) : ""}
                    disabled={programsPending}
                    onChange={(e) => updateFilter({ programId: e.target.value })}
                    options={(programs ?? []).map((prog) => ({
                        value: String(prog.id),
                        label: `${prog.code} - ${prog.name}`,
                    }))}
                />
            </div>

            <div className="w-full sm:max-w-72">
                <Select
                    label="Semester"
                    placeholder="Select Semester"
                    helperText={programId ? "Select a semester to see available resources." : "Select a program first."}
                    value={semester ?? ""}
                    onChange={(e) => updateFilter({ semester: e.target.value })}
                    options={Object.keys(SemesterLabel).map((sem) => ({
                        value: sem,
                        label: `${SemesterLabel[sem as Semester]} ${+sem > 8 ? "(Architecture)" : ""}`,
                    }))}
                />
            </div>

            {hasOfferings && (
                <SubjectTabs
                    subjects={subjectOfferings}
                    onSubjectSelect={(subject) => setSelectedSubject(subject)}
                />
            )}
        </div>
    );

    if (waitingForProfileDefault || pendingAutoRedirect) {
        return (
            <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto md:px-8 px-6 md:space-y-8 space-y-6">
                <div className="pt-6 md:pt-8">{filterBar}</div>
                <div className="flex-1 flex items-center justify-center py-16">
                    <Loader text="Loading your resources. Please wait." />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto md:px-8 px-6 md:space-y-8 space-y-6">
            <div className="sticky md:top-0 md:pt-8 pt-6 bg-background/40 backdrop-blur-sm border-b pb-6">
                {filterBar}
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
                <div className="flex-1 border flex items-center justify-center rounded-lg py-16">
                    <p className="text-sm text-foreground-secondary">
                        Select a program and semester above to browse resources.
                    </p>
                </div>
            ) : offeringsPending ? (
                <div className="flex-1 flex items-center justify-center py-16">
                    <Loader text="Loading resources. Please wait." />
                </div>
            ) : offeringsError ? (
                <div className="flex-1 flex items-center justify-center py-16">
                    <p className="text-red-500">Something went wrong. Please try again later.</p>
                </div>
            ) : !hasOfferings ? (
                <div className="flex-1 border flex items-center justify-center rounded-lg py-16">
                    <p className="text-sm text-foreground-secondary">
                        No resources available for this program and semester.
                    </p>
                </div>
            ) : (
                <>
                    <div>
                        <div className="flex flex-row items-center gap-2">
                            <Button
                                variant="ghost"
                                size="xs"
                                iconOnly
                                icon={showSubjectDetails ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                onClick={() => setShowSubjectDetails((prev) => !prev)}
                                className="border border-border"
                            />
                            <h3 className="text-lg">Subject Details</h3>
                        </div>
                        {showSubjectDetails && currentSubject && (
                            <SubjectDetails
                                subject={currentSubject}
                            />
                        )}
                    </div>

                    <div className="pb-6 md:pb-8">
                        <h3 className="text-lg">Available Resources</h3>
                        <ResourceList
                            resources={resources || []}
                            loading={resourcesLoading}
                            error={resourcesError ? "Failed to load resources" : null}
                            renderItem={(resource) =>
                                <ResourceCard
                                    resource={resource}
                                />
                            }
                            emptyMessage="No resources available for this subject."
                        />
                    </div>
                </>
            )}
        </div>
    )
}

const ResourcesPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <Loader text="Loading resources. Please wait." />
            </div>
        }>
            <ResourcesBrowseContent />
        </Suspense>
    );
}

export default ResourcesPage;
