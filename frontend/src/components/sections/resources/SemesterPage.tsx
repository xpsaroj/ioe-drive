"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { programs, departmentSubjects, Subject } from "@/constants/resources";
import { CloudUpload } from "lucide-react";
import Link from "next/link";
import { subjectDetailsData } from "@/constants/resources";

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
    const [currentSubject, setCurrentSubject] = useState<string | null>(subject || null);

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
                        <span className="font-bold text-md sm:text-xl text-primary">
                            Upload Notes and PDFs
                        </span>
                    </button>
                </div>
                {/* Subjects */}
                <div className="border w-full border-gray-300 mt-8 p-4 rounded-lg">
                    {/* Desktop Grid */}
                    <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {subjects.map((sub) => {
                            const isActive = sub.code === subject;
                            return (
                                <Link
                                    key={sub.code}
                                    href={`/resources/${department}/${semester}/${sub.code}`}
                                    className={`p-2 flex items-center justify-center h-14 max-w-44 text-center text-sm rounded-lg shadow-md transition-colors
            ${isActive
                                            ? "bg-accent text-white"
                                            : "bg-accent-faded text-primary"
                                        }`}
                                >
                                    {sub.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Dropdown */}
                    <div className="sm:hidden">
                        <h3 className="py-2">Choose Subject For Notes:</h3>
                        <select
                            value={currentSubject || ""}
                            onChange={(e) => router.push(`/resources/${department}/${semester}/${e.target.value}`)}
                            className="w-full p-2 border rounded-lg text-sm text-primary bg-white"
                        >
                            <option value="" disabled>Select Subject</option>
                            {subjects.map((sub) => (
                                <option key={sub.code} value={sub.code}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="border border-gray-300 w-full p-4 rounded-lg">
                    {/* about subject */}
                    <div className="border flex md:flex-row justify-between gap-2 flex-col w-full sm:pr-6 border-gray-300 mt-4 p-2 rounded-lg">
                        {/* get the subject header here containing the name , level,code and all , for now dummy data*/}
                        <div className="lg:pl-5">
                            <h2 className="text-lg font-bold text-primary">
                                {subjectDetailsData?.name || 'Subject Name'}
                            </h2>
                            <p className="text-sm text-gray-600 mb-1 pl-1 border-l-2 border-l-red-600">
                                {subjectDetailsData?.level}
                            </p>
                            <p className="text-sm mt-2 md:w-3/4 text-gray-700 mb-2">
                                {subjectDetailsData?.description || 'Subject Description'}
                            </p>


                        </div>

                        <div>
                            <p className="text-sm text-primary"><span className="font-semibold">Code:</span> {subjectDetailsData?.code || 'SUB101'}</p>
                            <p className="text-sm text-primary"><span className="font-semibold">Credits:</span> {subjectDetailsData?.credits || 3}</p>
                            <div className="mt-2">
                                <h4 className="font-semibold text-primary">Exam Types:</h4>
                                <ul className="list-disc list-inside">
                                    {subjectDetailsData?.examType.map((exam, index) => (
                                        <li key={index} className="text-sm text-gray-700">
                                            {exam.type}: {exam.marks} marks
                                        </li>
                                    ))}
                                </ul>

                            </div>

                        </div>
                    </div>
                    {/* Help Related to each subject */}
                    <div className="border w-full mx-auto border-gray-300 mt-4 sm:mt-6 p-2 rounded-lg">
                        {/* Desktop Grid */}
                        <div className="hidden lg:grid grid-flow-col auto-cols-max gap-4 justify-center ">
                            {['Tips to tackle', 'Syllabus', 'Microsyllabus', 'Questions Bank', 'Assesement Qns'].map((helpItem) => (
                                <Link
                                    key={`${currentSubject}-${helpItem}`}
                                    href={`/api/resources/${currentSubject}/${helpItem.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="flex items-center justify-center h-8 w-40 text-center text-sm rounded-lg shadow-md transition-colors bg-gray-300 text-primary hover:bg-accent"
                                >
                                    {helpItem}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Dropdown */}
                        <div className="lg:hidden">
                            <select
                                value=""
                                onChange={(e) => router.push(`/api/resources/${currentSubject}/${e.target.value}`)}
                                className="w-full p-2 border rounded-lg text-sm text-primary bg-white"
                            >
                                <option value="" disabled>Select Help Item</option>
                                {['Tips to tackle', 'Syllabus', 'Microsyllabus', 'Questions Bank', 'Assesement Qns'].map((helpItem) => (
                                    <option key={helpItem} value={helpItem.toLowerCase().replace(/\s+/g, '-')}>
                                        {helpItem}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
