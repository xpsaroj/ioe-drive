import { apiClient } from "./api-client";
import type { User, UserProfile, Department, ApiResponse } from "@/types";

interface ProfileWithDepartment extends UserProfile {
    department?: Department;
}

export interface MyProfile extends User {
    profile: ProfileWithDepartment;
}

export const meApi = {
    /**
     * Fetches the profile of the currently authenticated user. 
     * @return A promise that resolves to the API response containing the user's profile.
     */
    async getMyProfile(): Promise<ApiResponse<MyProfile>> {
        return apiClient.get<ApiResponse<MyProfile>>("/me");
    }
}