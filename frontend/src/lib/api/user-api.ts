import { apiClient } from "./api-client";
import { ApiResponse, UserProfile } from "@/types";

const USER_API_BASE_URL = "/users";

export const userApi = {
    async getUserById(userId: string): Promise<ApiResponse<UserProfile>> {
        return apiClient.get <ApiResponse<UserProfile>>(`${USER_API_BASE_URL}/${userId}`);
    }
}