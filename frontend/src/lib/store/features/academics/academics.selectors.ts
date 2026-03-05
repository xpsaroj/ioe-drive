import type { RootState } from "../../store";

export const selectPrograms = (state: RootState) => state.academics.programs;
export const selectSubjectOfferings = (state: RootState) => state.academics.subjectOfferings;