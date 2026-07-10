import type { Semester } from "../entities";

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

/** A lean subject-offering search result row - just enough to render a compact
 * subject/offering preview (e.g. the search palette, the /search page): no marks,
 * description, syllabusUrl, or hardnessLevel, unlike SubjectOfferingWithSubject. */
export interface SubjectSearchResult {
    id: number;
    semester: Semester;
    subject: SubjectSummary;
    program: ProgramSummary;
}