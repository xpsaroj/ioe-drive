import { NotebookPen } from "lucide-react";

import SubjectDetails from "./SubjectDetails";
import AcademicTermInfo from "./AcademicTermInfo";
import Button from "@/components/ui/Button";

import type { SubjectOfferingWithSubject } from "@/types/entities";

const SubjectOfferingDetails = ({ offering }: { offering: SubjectOfferingWithSubject }) => {
    const { id, subject, year, semester, isElective, programId } = offering;

    // programId here is deliberately the *offering's* program (the one this subject is
    // actually taught in for this semester) - not subject.program, which is the
    // subject's owning department and can differ (e.g. a first-year SH-owned subject
    // offered to BCT students should browse under BCT, not SH).
    const browseResourcesHref = `/resources?programId=${programId}&semester=${semester}&offeringId=${id}`;

    return (
        <div className="space-y-6">
            <AcademicTermInfo
                year={year}
                semester={semester}
                isElective={isElective}
                action={
                    <Button href={browseResourcesHref} variant="secondary" size="sm" icon={<NotebookPen className="size-4" />}>
                        Browse Resources
                    </Button>
                }
            />

            <SubjectDetails
                subject={subject}
            />

            <p className="text-center text-sm text-foreground-tertiary">
                (The information provided above may not always be accurate. Please verify it with official sources if anything seems incorrect.)
            </p>
        </div>
    )
}

export default SubjectOfferingDetails;