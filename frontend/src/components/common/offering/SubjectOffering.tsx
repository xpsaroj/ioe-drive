import Program from "./Program";
import Subject from "./Subject";
import AcademicTermInfo from "./AcademicTermInfo";

import type { SubjectOfferingWithSubject } from "@/types";

const SubjectOffering = ({ offering }: { offering: SubjectOfferingWithSubject }) => {
    return (
        <div className="border md:p-8 p-6 rounded-xl shadow-sm bg-background md:space-y-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{offering.subject.code}</h1>
                <h2 className="text-xl font-semibold">{offering.subject.name}</h2>
            </div>

            <div>
                <h3 className="text-lg">Offered in</h3>
                <Program program={offering.program} />
            </div>

            <div>
                <h3 className="text-lg">Offering Details</h3>
                <AcademicTermInfo
                    year={offering.year}
                    semester={offering.semester}
                    isElective={offering.isElective}
                />
            </div>

            <div>
                <h3 className="text-lg">Subject Details</h3>
                <Subject
                    subject={offering.subject}
                    program={offering.subject.program}
                />
            </div>

            <p className="text-sm text-foreground-tertiary text-center">(The information provided above may not always be accurate. Please verify it with official sources if anything seems incorrect.)</p>
        </div>
    )
}

export default SubjectOffering;