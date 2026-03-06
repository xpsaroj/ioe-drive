import Link from "next/link";

import type { Program as ProgramType } from "@/types";

const Program = ({ program }: { program: ProgramType }) => {
    return (
        <div
            className="border p-6 rounded-lg bg-white"
        >
            <p className="text-xl font-bold">{program.code}</p>
            <div className="flex flex-col md:flex-row justify-between">
                <p className="font-semibold text-lg">{program.name}</p>
                <p>Total Years: {program.totalYears}</p>
            </div>
            {program.syllabusUrl && (
                <p className="text-sm">Syllabus: {" "}
                    <Link href={program.syllabusUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {program.code} Syllabus (IOE)
                    </Link>
                </p>
            )}
        </div>
    )
}

export default Program;