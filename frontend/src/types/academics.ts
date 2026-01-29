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

export enum SemesterEnum {
    FIRST = "1st",
    SECOND = "2nd",
    THIRD = "3rd",
    FOURTH = "4th",
    FIFTH = "5th",
    SIXTH = "6th",
    SEVENTH = "7th",
    EIGHTH = "8th",
}

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
    semester: SemesterEnum;
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

export interface SubjectWithDepartment extends Subject {
    department: Department;
}

export interface SubjectOfferingWithSubject extends SubjectOffering {
    subject: SubjectWithDepartment;
}