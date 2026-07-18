import Link from "next/link";
import { BookOpen } from "lucide-react";

import { cn } from "@/utils/cn";
import type { Program } from "@/types/entities";

interface ProgramCardProps {
    program: Program;
    href?: string;
    className?: string;
}

// Shared "program identity" card - code badge + name + code/years, reused by the subject
// detail page's "Belongs to Program" block, the programs list, and the program detail page.
const ProgramCard = ({ program, href, className }: ProgramCardProps) => {
    const header = (
        <>
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent font-display text-sm font-semibold text-accent-foreground">
                {program.code}
            </span>
            <div className="min-w-0">
                <p className={cn("truncate font-semibold text-foreground", href && "decoration-2 underline-offset-2 group-hover:underline")}>
                    {program.code !== "SH" ? `Bachelor in ${program.name}` : program.name}
                </p>
                <p className="flex items-center gap-2 text-xs text-foreground-secondary">
                    <span>{program.code}</span>
                    <span>{program.totalYears} years</span>
                </p>
            </div>
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                className={cn(
                    "group flex items-center gap-3 rounded-xl border border-border bg-card-background p-5 transition-colors hover:border-accent hover:bg-card-hover",
                    className
                )}
            >
                {header}
            </Link>
        );
    }

    return (
        <div className={cn("rounded-xl border border-border bg-card-background p-5", className)}>
            <div className="flex items-center gap-3">{header}</div>

            {program.syllabusUrl && (
                <Link
                    href={program.syllabusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-xs text-link hover:text-link-hover hover:underline"
                >
                    <BookOpen className="size-3.5 shrink-0" />
                    {program.code} Syllabus (IOE)
                </Link>
            )}
        </div>
    );
};

export default ProgramCard;
