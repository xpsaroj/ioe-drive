import { apiClient } from "./api-client";
import type { UserProfile, Profile } from "@/types/entities";
import type { ApiResponse, EmptyApiResponse, ResourceSummary, RecentResourceItem, BookmarkedResourceItem } from "@/types/api";

const ME_API_BASE_URL = "/me";

export const meApi = {
    async getMyProfile(): Promise<ApiResponse<UserProfile>> {
        return apiClient.get<ApiResponse<UserProfile>>(`${ME_API_BASE_URL}`);
    },

    async updateMyProfile(profileData: Partial<Omit<Profile, "id" | "userId">>): Promise<EmptyApiResponse> {
        return apiClient.patch<EmptyApiResponse>(`${ME_API_BASE_URL}`, profileData);
    },

    async getUploadedResources(): Promise<ApiResponse<ResourceSummary[]>> {
        return apiClient.get<ApiResponse<ResourceSummary[]>>(`${ME_API_BASE_URL}/resources`);
    },

    async getRecentResources(): Promise<ApiResponse<RecentResourceItem[]>> {
        return apiClient.get<ApiResponse<RecentResourceItem[]>>(`${ME_API_BASE_URL}/recent-resources`);
    },

    /**
     * Fetches the bookmarked resources of the currently authenticated user.
     */
    async getBookmarkedResources(): Promise<ApiResponse<BookmarkedResourceItem[]>> {
        return apiClient.get<ApiResponse<BookmarkedResourceItem[]>>(`${ME_API_BASE_URL}/bookmarked-resources`);
    },

    /**
     * Fetches every resource ID the currently authenticated user has ever bookmarked
     * (uncapped, IDs only) - meant for checking bookmark status across many resources
     * at once (e.g. a bookmark icon on every card in a list), not for display.
     */
    async getBookmarkedResourceIds(): Promise<ApiResponse<number[]>> {
        return apiClient.get<ApiResponse<number[]>>(`${ME_API_BASE_URL}/bookmarked-resource-ids`);
    },

    /**
     * Adds the resource to the user's `recently accessed` list.
     */
    async markResourceAsRecentlyAccessed(resourceId: string): Promise<EmptyApiResponse> {
        return apiClient.post<EmptyApiResponse>(`${ME_API_BASE_URL}/resources/${resourceId}/recent`);
    },

    /**
     * Bookmarks a resource for the user.
     */
    async markResourceAsBookmarked(resourceId: string): Promise<EmptyApiResponse> {
        return apiClient.post<EmptyApiResponse>(`${ME_API_BASE_URL}/resources/${resourceId}/bookmark`);
    },

    /**
     * Unbookmarks a resource for the user.
     */
    async unmarkResourceAsBookmarked(resourceId: string): Promise<EmptyApiResponse> {
        return apiClient.delete<EmptyApiResponse>(`${ME_API_BASE_URL}/resources/${resourceId}/bookmark`);
    },
}
