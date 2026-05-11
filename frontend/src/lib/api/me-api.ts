import { apiClient } from "./api-client";
import type { UserProfile, Profile } from "@/types/entities";
import type { ApiResponse, EmptyApiResponse, NoteCard, RecentNoteItem, ArchivedNoteItem } from "@/types/api";

const ME_API_BASE_URL = "/me";

export const meApi = {
    async getMyProfile(): Promise<ApiResponse<UserProfile>> {
        return apiClient.get<ApiResponse<UserProfile>>(`${ME_API_BASE_URL}`);
    },

    async updateMyProfile(profileData: Partial<Omit<Profile, "id" | "userId">>): Promise<EmptyApiResponse> {
        return apiClient.patch<EmptyApiResponse>(`${ME_API_BASE_URL}`, profileData);
    },

    async getUploadedNotes(): Promise<ApiResponse<NoteCard[]>> {
        return apiClient.get<ApiResponse<NoteCard[]>>(`${ME_API_BASE_URL}/notes`);
    },

    async getRecentNotes(): Promise<ApiResponse<RecentNoteItem[]>> {
        return apiClient.get<ApiResponse<RecentNoteItem[]>>(`${ME_API_BASE_URL}/recent-notes`);
    },

    /**
     * Fetches the archived/bookmarked notes of the currently authenticated user.
     */
    async getArchivedNotes(): Promise<ApiResponse<ArchivedNoteItem[]>> {
        return apiClient.get<ApiResponse<ArchivedNoteItem[]>>(`${ME_API_BASE_URL}/archived-notes`);
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