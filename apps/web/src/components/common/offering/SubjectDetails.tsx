import Link from "next/link";
import { BookOpen } from "lucide-react";

import SubjectHardnessBadge from "./SubjectHardnessBadge";
import Button from "@/components/ui/Button";
import type { SubjectWithProgramAndMarks } from "@/types/entities";

const SubjectDetails = ({ subject }: { subject: SubjectWithProgramAndMarks }) => {
    const { code, name, description, syllabusUrl, hardnessLevel, program, marks } = subject;

    const marksItems = marks ? [
        { label: "Theory Final", value: marks.theoryFinal },
        { label: "Theory Assessment", value: marks.theoryAssessment },
        { label: "Practical Final", value: marks.practicalFinal },
        { label: "Practical Assessment", value: marks.practicalAssessment },
    ] : [];
    const marksTotal = marksItems.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="space-y-5 rounded-xl border border-border p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="font-display text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
                        {code}
                    </p>
                    <h2 className="text-xl font-bold text-foreground">{name}</h2>
                </div>
                <SubjectHardnessBadge level={hardnessLevel} className="shrink-0" />
            </div>

            {description && (
                <p className="text-sm leading-relaxed text-foreground-secondary">{description}</p>
            )}

            {marksItems.length > 0 && (
                <div className="border-t border-border pt-4">
                    <p className="mb-1 font-display text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
                        Marks Distribution
                    </p>
                    <div className="flex flex-col">
                        {marksItems.map((item) => (
                            <div key={item.label} className="flex items-center justify-between py-1.5">
                                <span className="text-sm text-foreground-secondary">{item.label}</span>
                                <span className="text-sm font-medium text-foreground">{item.value}</span>
                            </div>
                        ))}
                        <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
                            <span className="text-sm font-semibold text-foreground">Total</span>
                            <span className="text-sm font-semibold text-foreground">{marksTotal}</span>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <p className="mb-1 font-display text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
                    Belongs to Program
                </p>
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent px-1 font-display text-xs font-semibold text-accent-foreground">
                        {program.code}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-foreground">
                            {program.code !== "SH" ? `Bachelor in ${program.name}` : program.name}
                        </p>
                        <p className="flex items-center gap-2 text-xs text-foreground-secondary">
                            <span>{program.code}</span>
                            <span>{program.totalYears} years</span>
                        </p>
                        {program.syllabusUrl && (
                            <p className="mt-1 text-xs">
                                <Link href={program.syllabusUrl} target="_blank" rel="noopener noreferrer" className="text-link hover:text-link-hover hover:underline">
                                    {program.code} Syllabus (IOE)
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {syllabusUrl && (
                <Button
                    href={syllabusUrl}
                    variant="secondary"
                    icon={<BookOpen className="size-4" />}
                    className="w-full"
                >
                    View Official Syllabus
                </Button>
            )}
        </div>
    )
}

export default SubjectDetails;
