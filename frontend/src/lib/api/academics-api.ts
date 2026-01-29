import { apiClient } from "./api-client";
import type { ApiResponse, Department, SemesterEnum, SubjectOfferingWithSubject } from "@/types";

export interface SubjectsFilters {
    departmentId: number;
    semester?: SemesterEnum;
}

export const academicsApi = {
    async getAllDepartments(): Promise<ApiResponse<Department[]>> {
        return apiClient.get<ApiResponse<Department[]>>("/departments");
    },

    /**
     * Get subjects filtered by department and semester.
     * - If semester is not provided, fetches all subjects for the department.
     */
    async getSubjectsByDepartmentAndSemester(filters: SubjectsFilters): Promise<ApiResponse<SubjectOfferingWithSubject[]>> {
        const params = new URLSearchParams({
            departmentId: filters.departmentId.toString(),
        });
        if (filters.semester) {
            params.append("semester", filters.semester);
        }

        return apiClient.get<ApiResponse<SubjectOfferingWithSubject[]>>(`/subjects?${params.toString()}`);
    },

    async getSubjectDetails(subjectId: number): Promise<ApiResponse<SubjectOfferingWithSubject>> {
        return apiClient.get<ApiResponse<SubjectOfferingWithSubject>>(`/subjects/${subjectId}`);
    },
}