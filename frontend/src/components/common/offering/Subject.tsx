import Link from "next/link";

import Program from "./Program";
import SubjectHardnessBadge from "./SubjectHardnessBadge";
import type { Subject as SubjectType, Program as ProgramType } from "@/types";

const Subject = ({ subject, program }: { subject: SubjectType, program: ProgramType }) => {
    return (
        <div
            className="border p-6 rounded-xl shadow-sm bg-white"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{subject.code}</h2>
                <SubjectHardnessBadge level={subject.hardnessLevel} />
            </div>
            <p className="text-lg font-semibold">{subject.name}</p>

            {subject.description && (
                <p className="text-sm text-foreground-secondary">
                    {subject.description}
                </p>
            )}
            {subject.syllabusUrl && (
                <p className="text-sm">Syllabus: {" "}
                    <Link href={subject.syllabusUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {subject.code} Syllabus (IOE)
                    </Link>
                </p>
            )}

            <h4 className="text-lg mt-3">Belongs to Program:</h4>
            <Program program={program} />
        </div>
    )
}

export default Subject;