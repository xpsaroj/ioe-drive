import { apiClient } from "./api-client";
import type { ApiResponse, Program, Semester, SubjectOfferingWithSubject, SubjectForUploadForm } from "@/types";

export interface SubjectsFilters {
    programId: number;
    semester?: Semester;
}

export interface ResourceUploadFormFilters {
    programId: number;
    semester: Semester;
}

export const academicsApi = {
    async getAllPrograms(): Promise<ApiResponse<Program[]>> {
        return apiClient.get<ApiResponse<Program[]>>("/programs");
    },

    /**
     * Get subjects filtered by program and semester.
     * - If semester is not provided, fetches all subjects for the program.
     */
    async getSubjectsByProgramAndSemester(filters: SubjectsFilters): Promise<ApiResponse<SubjectOfferingWithSubject[]>> {
        const params = new URLSearchParams({
            programId: filters.programId.toString(),
        });
        if (filters.semester) {
            params.append("semester", filters.semester);
        }

        return apiClient.get<ApiResponse<SubjectOfferingWithSubject[]>>(`/subjects?${params.toString()}`);
    },

    async getSubjectDetails(subjectId: number): Promise<ApiResponse<SubjectOfferingWithSubject>> {
        return apiClient.get<ApiResponse<SubjectOfferingWithSubject>>(`/subjects/${subjectId}`);
    },

    /**
     * Get subjects for the resource upload form based on program, semester, and year.
     * - For select based on user input in the upload form.
     */
    async getSubjectsForUpload(filters: ResourceUploadFormFilters): Promise<ApiResponse<SubjectForUploadForm[]>> {
        const params = new URLSearchParams({
            programId: filters.programId.toString(),
            semester: filters.semester,
        })
        return apiClient.get<ApiResponse<SubjectForUploadForm[]>>(`/subjects/upload/?${params.toString()}`);
    }
}