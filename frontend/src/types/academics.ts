export interface Department {
    id: number;
    code: string;
    name: string;
}

export enum SubjectHardnessLevel {
    EASY = "Easy",
    MEDIUM = "Medium",
    HARD = "Hard",
    VERY_HARD = "Very Hard",
}

export type Semester = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export const SemesterLabel: Record<Semester, string> = {
    "1": "1st",
    "2": "2nd",
    "3": "3rd",
    "4": "4th",
    "5": "5th",
    "6": "6th",
    "7": "7th",
    "8": "8th",
};

export interface Subject {
    id: number;
    code: string;
    name: string;
    departmentId: number;
    hardnessLevel: SubjectHardnessLevel;
    description?: string;
}

export interface SubjectOffering {
    id: number;
    subjectId: number;
    semester: Semester;
    departmentId: number;
    year: number;
}

export interface Marks {
    id: number;
    subjectId: number;
    theoryAssessment: number;
    theoryFinal: number;
    practicalAssessment: number;
    practicalFinal: number;
}

export interface SubjectWithDepartmentandMarks extends Subject {
    department: Department;
    marks: Marks;
}

export interface SubjectOfferingWithSubject extends SubjectOffering {
    subject: SubjectWithDepartmentandMarks;
}