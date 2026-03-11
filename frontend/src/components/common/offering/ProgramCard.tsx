import Link from "next/link";

import type { Program } from "@/types";

const ProgramCard = ({ program }: { program: Program }) => {
    const { code, name, totalYears, syllabusUrl } = program;

    return (
        <div
            className="border p-6 rounded-lg bg-white"
        >
            <p className="text-xl font-bold">{code}</p>
            <div className="flex flex-col md:flex-row justify-between">
                <p className="font-semibold text-lg">{code !== "SH" && "Bachelor in"} {name}</p>
                <p>Total Years: {totalYears}</p>
            </div>
            {syllabusUrl && (
                <p className="text-sm">Syllabus: {" "}
                    <Link href={syllabusUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {code} Syllabus (IOE)
                    </Link>
                </p>
            )}
        </div>
    )
}

export default ProgramCard;