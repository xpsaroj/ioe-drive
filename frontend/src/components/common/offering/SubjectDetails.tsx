import Link from "next/link";

import ProgramCard from "./ProgramCard";
import SubjectHardnessBadge from "./SubjectHardnessBadge";
import Table, { Column } from "@/components/ui/Table";
import type { SubjectWithProgramAndMarks, Marks } from "@/types";

const SubjectDetails = ({ subject }: { subject: SubjectWithProgramAndMarks }) => {
    if (!subject) return null;

    const { code, name, description, syllabusUrl, hardnessLevel, program } = subject;

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
                <h2 className="text-lg font-bold">{code}</h2>
                <SubjectHardnessBadge level={hardnessLevel} />
            </div>
            <p className="text-lg font-semibold">{name}</p>

            {description && (
                <p className="text-sm mb-1 text-foreground-secondary">
                    {description}
                </p>
            )}
            {syllabusUrl && (
                <p className="text-sm">Syllabus: {" "}
                    <Link href={syllabusUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {code} Syllabus (IOE)
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
            <ProgramCard program={program} />
        </div>
    )
}

export default SubjectDetails;