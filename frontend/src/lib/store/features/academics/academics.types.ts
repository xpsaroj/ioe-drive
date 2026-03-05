import type { Program, SubjectOfferingWithSubject, AsyncState } from "@/types";

export interface AcademicsState {
    programs: AsyncState<Program[]>;
    subjectOfferings: AsyncState<SubjectOfferingWithSubject[]>;
}