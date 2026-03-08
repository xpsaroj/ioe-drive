"use client"
import { useState } from "react";

import { SubjectDetails } from "@/components/common/offering";
import { SubjectTabs, ResourceList } from "@/components/common/resources";
import { useMe } from "@/hooks/queries/use-me";
import { useSubjectOfferings } from "@/hooks/queries/use-academics";
import { useNotesBySubjectId } from "@/hooks/queries/use-notes";
import { SubjectOfferingWithSubject } from "@/types";

const CurrentResourcesPage = () => {
    const { data: userData } = useMe();
    const profile = userData?.profile;

    const { data: subjectOfferings, isLoading: offeringsLoading, error } = useSubjectOfferings(profile?.programId, profile?.semester);

    const [selectedSubject, setSelectedSubject] = useState<SubjectOfferingWithSubject | null>(null);
    const { data: notes, isLoading: notesLoading, error: notesError } = useNotesBySubjectId(
        selectedSubject
            ? selectedSubject?.subject?.id
            : subjectOfferings?.[0]?.subject.id
    );

    if (offeringsLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
            </div>
        )
    }

    if (error || !subjectOfferings) {
        return (
            <div className="min-h-screen bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto md:px-8 px-6 md:space-y-8 space-y-6">
            <div className="sticky md:top-0 md:pt-8 pt-6 bg-background/40 backdrop-blur-sm border-b">
                <SubjectTabs
                    subjects={subjectOfferings || []}
                    onSubjectSelect={(subject) => setSelectedSubject(subject)}
                />
            </div>

            <div>
                <h3 className="text-lg">Subject Details</h3>
                <SubjectDetails
                    subject={selectedSubject ? selectedSubject.subject : subjectOfferings?.[0]?.subject}
                />
            </div>

            <div className="pb-6 md:pb-8">
                <h3 className="text-lg">Available Resources</h3>
                <ResourceList
                    resources={notes || []}
                    loading={notesLoading}
                    error={notesError ? "Failed to load resources" : undefined}
                />
            </div>
        </div>
    )
}

export default CurrentResourcesPage;