"use client"
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

import { SubjectDetails } from "@/components/common/offering";
import { SubjectTabs, ResourceList } from "@/components/common/resources";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { useMe } from "@/hooks/queries/use-me";
import { useSubjectOfferings } from "@/hooks/queries/use-academics";
import { useNotesBySubjectId } from "@/hooks/queries/use-notes";
import { SubjectOfferingWithSubject } from "@/types";

const CurrentResourcesPage = () => {
    const { data: userData } = useMe();
    const profile = userData?.profile;

    const { data: subjectOfferings, isLoading: offeringsLoading, error, isPending } = useSubjectOfferings(profile?.programId, profile?.semester);

    const [selectedSubject, setSelectedSubject] = useState<SubjectOfferingWithSubject | null>(null);
    const [showSubjectDetails, setShowSubjectDetails] = useState(false);

    const currentSubject = selectedSubject?.subject ?? subjectOfferings?.[0]?.subject;

    const { data: resources, isLoading: resourcesLoading, error: resourcesError } = useNotesBySubjectId(currentSubject?.id);

    if (offeringsLoading || isPending || resourcesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center">
                    <Loader text="Loading resources. Please wait." />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <p className="text-red-500">Something went wrong. Please try again later.</p>
            </div>
        )
    }

    if (!subjectOfferings || subjectOfferings.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center gap-2 max-w-xl text-center">
                    <p className="text-red-500">
                        Oops. Looks like there are no resources available.
                    </p>
                    <p className="text-sm text-foreground-secondary">
                        Make sure you have set your program and semester in your profile.
                        Update your profile with the required information to get subject details and notes for the subjects in your current semester and program.
                    </p>
                    <Button
                        href="/profile"
                    >
                        Update Profile
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto md:px-8 px-6 md:space-y-8 space-y-6">
            <div className="sticky md:top-0 md:pt-8 pt-6 bg-background/40 backdrop-blur-sm border-b">
                <SubjectTabs
                    subjects={subjectOfferings}
                    onSubjectSelect={(subject) => setSelectedSubject(subject)}
                />
            </div>

            <div>
                <div className="flex flex-row items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        icon={showSubjectDetails ? <ChevronDown /> : <ChevronRight />}
                        onClick={() => setShowSubjectDetails((prev) => !prev)}
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
                    error={resourcesError ? "Failed to load resources" : undefined}
                />
            </div>
        </div>
    )
}

export default CurrentResourcesPage;