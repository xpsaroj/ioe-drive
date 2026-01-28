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
    semester: number;
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