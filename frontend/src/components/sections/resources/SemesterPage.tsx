"use client";

import { useParams, useRouter } from "next/navigation";
import { programs, departmentSubjects, Subject } from "@/constants/resources";
import { CloudUpload } from "lucide-react";
import Link from "next/link";


function getOrdinal(n: number) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export default function SemesterPage() {
    const { department, semester, subject } = useParams<{
        department: string;
        semester: string;
        subject?: string;
    }>();
    const router = useRouter();

    const departmentName =
        programs.find((prog) => prog.code === department)?.name || "Computer Engineering";

    // Get the subjects for this department + semester
    const subjects: Subject[] = departmentSubjects[department]?.[semester] || [];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative z-0">
                <div
                    onClick={() => router.push(`/dashboard/upload`)}
                    className="absolute left-0 top-8 px-4 py-2 bg-accent-faded w-fit rounded-r-full z-10 shadow-md">
                    <h2 className="text-primary font-bold text-sm md:text-xl">
                        {getOrdinal(Number(semester))} Semester
                    </h2>
                    <p className="text-gray-700 text-[8px]">{departmentName}</p>
                    <p className="text-gray-700 text-[8px]">
                        Click to change the semester or view all the semesters
                    </p>
                </div>
            </div>

            {/* Upload button */}
            <div className="max-w-7xl mx-auto flex flex-col space-y-5 items-center justify-center min-h-screen px-4 py-28 md:py-8">
                <div>
                    <button
                        type="button"
                        className="bg-white h-fit rounded-full border border-gray-300 flex items-center gap-2 p-2"
                    >
                        <CloudUpload className="w-10 h-10 text-yellow-500" />
                        <span className="font-bold text-xl text-primary">
                            Upload Notes and PDFs
                        </span>
                    </button>
                </div>

                {/* Subjects */}
                <div className="border border-gray-300 mt-8 p-4 rounded-lg grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {subjects.map((sub) => {
                        const isActive = sub.code === subject;
                        return (
                            <Link
                                key={sub.code}
                                href={`/resources/${department}/${semester}/${sub.code}`}
                                className={`p-2 flex items-center justify-center h-14 max-w-44 text-center text-sm rounded-lg shadow-md transition-colors
                  ${isActive
                                        ? "bg-primary text-white"
                                        : "bg-accent-faded text-primary hover:bg-accent"
                                    }`}
                            >
                                {sub.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
