export interface SubjectSummary {
    id: number;
    code: string;
    name: string;
}

export interface SubjectOfferingSummary {
    id: number;
    subjectId: number
}

export interface ProgramSummary {
    id: number;
    name: string;
    code: string;
}