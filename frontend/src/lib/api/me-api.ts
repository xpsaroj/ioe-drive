import { apiClient } from "./api-client";
import type { UserProfile, ApiResponse, UploadedNote, RecentNote, ArchivedNote, EmptyApiResponse } from "@/types";

const ME_API_BASE_URL = "/me";

export const meApi = {
    async getMyProfile(): Promise<ApiResponse<UserProfile>> {
        return apiClient.get<ApiResponse<UserProfile>>(`${ME_API_BASE_URL}`);
    },

    async getUploadedNotes(): Promise<ApiResponse<UploadedNote[]>> {
        return apiClient.get<ApiResponse<UploadedNote[]>>(`${ME_API_BASE_URL}/notes`);
    },

    async getRecentNotes(): Promise<ApiResponse<RecentNote[]>> {
        return apiClient.get<ApiResponse<RecentNote[]>>(`${ME_API_BASE_URL}/recent-notes`);
    },

    /**
     * Fetches the archived/bookmarked notes of the currently authenticated user.
     */
    async getArchivedNotes(): Promise<ApiResponse<ArchivedNote[]>> {
        return apiClient.get<ApiResponse<ArchivedNote[]>>(`${ME_API_BASE_URL}/archived-notes`);
    },

    /**
     * Adds the note to the user's `recently accessed` list.
     */
    async markNoteAsRecentlyAccessed(noteId: string): Promise<EmptyApiResponse> {
        return apiClient.post<EmptyApiResponse>(`${ME_API_BASE_URL}/notes/${noteId}/recent`);
    },

    /**
     * Archives/bookmarks a note for the user.
     */
    async markNoteAsArchived(noteId: string): Promise<EmptyApiResponse> {
        return apiClient.post<EmptyApiResponse>(`${ME_API_BASE_URL}/notes/${noteId}/archive`);
    },

    /**
     * Unmarks a note as archived by the user.
     */
    async unmarkNoteAsArchived(noteId: string): Promise<EmptyApiResponse> {
        return apiClient.delete<EmptyApiResponse>(`${ME_API_BASE_URL}/notes/${noteId}/archive`);
    },
}