import Badge from "@/components/ui/Badge";
import type { SubjectOffering } from "@/types/entities";

const numberToRoman = (num: number): string => {
    const romanNumerals: { [key: number]: string } = {
        1: "I",
        2: "II",
        3: "III",
        4: "IV",
        5: "V",
        7: "VII",
        8: "VIII",
        9: "IX",
        10: "X",
    };
    return romanNumerals[num] || num.toString();
}

interface AcademicTermInfoProps extends Omit<SubjectOffering, "id" | "subjectId" | "programId"> {
    /** Optional compact action rendered beside the heading (e.g. a "Browse Resources"
     * link) - kept as a slot rather than owned by this display-only component. */
    action?: React.ReactNode;
}

const AcademicTermInfo = ({ year, semester, isElective, action }: AcademicTermInfoProps) => {
    return (
        <div className="rounded-xl border border-border p-6">
            <p className="mb-2 font-display text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
                Offering Details
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-foreground">
                            Year {numberToRoman(+year)}, Part {numberToRoman(Math.floor(+semester / +year))}
                        </h2>
                        {isElective && <Badge size="sm">Elective</Badge>}
                    </div>
                    <p className="mt-1 flex items-center gap-3 text-sm text-foreground-secondary">
                        <span>Year {year}</span>
                        <span>Semester {semester}</span>
                    </p>
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
        </div>
    );
}

export default AcademicTermInfo;
