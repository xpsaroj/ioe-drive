import { apiClient } from "./api-client";
import type { User, UserProfile, Department, ApiResponse } from "@/types";

interface ProfileWithDepartment extends UserProfile {
    department?: Department;
}

export interface MyProfile extends User {
    profile: ProfileWithDepartment;
}

const ME_API_BASE_URL = "/me";

export const meApi = {
    /**
     * Fetches the profile of the currently authenticated user. 
     * @return A promise that resolves to the API response containing the user's profile.
     */
    async getMyProfile(): Promise<ApiResponse<MyProfile>> {
        return apiClient.get<ApiResponse<MyProfile>>(`${ME_API_BASE_URL}`);
    },

    async getUplodoadedNotes() {
        return apiClient.get<ApiResponse<any>>(`${ME_API_BASE_URL}/notes`);
    },

    async getRecentNotes() {
        return apiClient.get<ApiResponse<any>>(`${ME_API_BASE_URL}/recent-notes`);
    },

    async getArchivedNotes() {
        return apiClient.get<ApiResponse<any>>(`${ME_API_BASE_URL}/archived-notes`);
    },

    async markNoteAsRecentlyAccessed(noteId: string) {
        return apiClient.post<ApiResponse<any>>(`${ME_API_BASE_URL}/notes/${noteId}/recent`);
    },

    async markNoteAsArchived(noteId: string) {
        return apiClient.post<ApiResponse<any>>(`${ME_API_BASE_URL}/notes/${noteId}/archive`);
    },

    async unmarkNoteAsArchived(noteId: string) {
        return apiClient.delete<ApiResponse<any>>(`${ME_API_BASE_URL}/notes/${noteId}/archive`);
    },
}