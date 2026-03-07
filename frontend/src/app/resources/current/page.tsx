"use client"
import { useState } from "react";

import { useAppSelector } from "@/lib/store/hooks";
import { selectPrograms } from "@/lib/store/features/academics/academics.selectors";
import { selectSubjectOfferings } from "@/lib/store/features/academics/academics.selectors";
import { Subject } from "@/components/common/offering";
import { SubjectTabs } from "@/components/common/resources";
import { SubjectOfferingWithSubject } from "@/types";

const CurrentResourcesPage = () => {
    const programsState = useAppSelector(selectPrograms);
    const subjectOfferingState = useAppSelector(selectSubjectOfferings);

    const [selectedSubject, setSelectedSubject] = useState<SubjectOfferingWithSubject | null>(null);

    if (subjectOfferingState.loading || !programsState.data) {
        return (
            <div className="min-h-screen bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto md:px-8 px-6 md:space-y-8 space-y-6">
            <div className="sticky md:top-0 md:pt-8 pt-6 bg-background/40 backdrop-blur-sm border-b">
                <SubjectTabs
                    subjects={subjectOfferingState.data}
                    onSubjectSelect={(subject) => setSelectedSubject(subject)}
                />
            </div>

            <div>
                <h3 className="text-lg">Subject Details</h3>
                <Subject
                    subject={selectedSubject ? selectedSubject.subject : subjectOfferingState.data[0]?.subject}
                />
            </div>

            <div>
                <h3 className="text-lg h-screen">Available Resources</h3>
            </div>
        </div>
    )
}

export default CurrentResourcesPage;