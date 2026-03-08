import ProgramCard from "./ProgramCard";
import SubjectDetails from "./SubjectDetails";
import AcademicTermInfo from "./AcademicTermInfo";

import type { SubjectOfferingWithSubject } from "@/types";

const SubjectOfferingDetails = ({ offering }: { offering: SubjectOfferingWithSubject }) => {
    const { subject, program, year, semester, isElective } = offering;
    
    return (
        <div className="md:border md:p-8 rounded-lg md:space-y-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{subject.code}</h1>
                <h2 className="text-xl font-semibold">{subject.name}</h2>
            </div>

            <div>
                <h3 className="text-lg">Offered in</h3>
                <ProgramCard program={program} />
            </div>

            <div>
                <h3 className="text-lg">Offering Details</h3>
                <AcademicTermInfo
                    year={year}
                    semester={semester}
                    isElective={isElective}
                />
            </div>

            <div>
                <h3 className="text-lg">Subject Details</h3>
                <SubjectDetails
                    subject={subject}
                />
            </div>

            <p className="text-sm text-foreground-tertiary text-center">(The information provided above may not always be accurate. Please verify it with official sources if anything seems incorrect.)</p>
        </div>
    )
}

export default SubjectOfferingDetails;