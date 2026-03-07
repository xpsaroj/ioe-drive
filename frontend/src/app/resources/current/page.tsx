"use client"
import { useState } from "react";

import { Subject } from "@/components/common/offering";
import { SubjectTabs } from "@/components/common/resources";
import { SubjectOfferingWithSubject } from "@/types";

import { useMe } from "@/hooks/queries/use-me";
import { useSubjectOfferings } from "@/hooks/queries/use-academics";

const CurrentResourcesPage = () => {
    const { data: userData } = useMe();
    const profile = userData?.profile;

    const { data: subjectOfferings, isLoading: offeringsLoading, error } = useSubjectOfferings(profile?.programId, profile?.semester);

    const [selectedSubject, setSelectedSubject] = useState<SubjectOfferingWithSubject | null>(null);

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
                <Subject
                    subject={selectedSubject ? selectedSubject.subject : subjectOfferings?.[0]?.subject}
                />
            </div>

            <div>
                <h3 className="text-lg h-screen">Available Resources</h3>
            </div>
        </div>
    )
}

export default CurrentResourcesPage;