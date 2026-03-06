import type { SubjectOffering } from "@/types";

const AcademicTermInfo = ({ year, semester, isElective }: Omit<SubjectOffering, "id" | "subjectId" | "programId">) => {

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

    return (
        <div className="p-6 border rounded-lg bg-background">
            <p className="font-semibold">[Year {numberToRoman(+year)}: Part {numberToRoman(Math.floor(+semester/+year))}]</p>
            <p className="text-sm text-foreground-secondary">Year: {year}</p>
            <p className="text-sm text-foreground-secondary">Semester: {semester}</p>
            <p>{isElective && "Elective"}</p>
        </div>
    );
}

export default AcademicTermInfo;