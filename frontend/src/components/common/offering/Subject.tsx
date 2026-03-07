import Link from "next/link";

import Program from "./Program";
import SubjectHardnessBadge from "./SubjectHardnessBadge";
import Table, { Column } from "@/components/ui/Table";
import type { SubjectWithProgramAndMarks, Marks } from "@/types";

const Subject = ({ subject }: { subject: SubjectWithProgramAndMarks }) => {
    if (!subject) return null;

    const marks = subject?.marks ? [subject?.marks] : [];
    const marksColumn: Column<Marks>[] = [
        {
            key: "theoryFinal",
            label: "Theory Final",
        },
        {
            key: "theoryAssessment",
            label: "Theory Assessment",
        },
        {
            key: "practicalFinal",
            label: "Practical Final",
        },
        {
            key: "practicalAssessment",
            label: "Practical Assessment",
        },
    ];

    return (
        <div
            className="border p-6 rounded-lg bg-white"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{subject.code}</h2>
                <SubjectHardnessBadge level={subject.hardnessLevel} />
            </div>
            <p className="text-lg font-semibold">{subject.name}</p>

            {subject.description && (
                <p className="text-sm mb-1 text-foreground-secondary">
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

            <div>
                <h4 className="mt-3 font-medium">Marks Distribution</h4>
                <Table
                    data={marks}
                    columns={marksColumn}
                />
            </div>

            <h4 className="mt-3">Belongs to Program</h4>
            <Program program={subject.program} />
        </div>
    )
}

export default Subject;