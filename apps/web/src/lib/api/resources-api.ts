import { apiClient } from "./api-client";
import type { Resource } from "@/types/entities";
import type { ApiResponse, ResourceSummary } from "@/types/api";
import type { UpdateResourceInput } from "../validators/resources";

const RESOURCES_API_BASE_URL = "/resources";

export const resourcesApi = {
    async createResource(formData: FormData): Promise<ApiResponse<Resource>> {
        return apiClient.postForm<ApiResponse<Resource>>(`${RESOURCES_API_BASE_URL}`, formData);
    },

    async updateResource(resourceId: number, resourceData: UpdateResourceInput): Promise<ApiResponse<Resource>> {
        return apiClient.patch<ApiResponse<Resource>>(`${RESOURCES_API_BASE_URL}/${resourceId}`, resourceData);
    },

    async getResourceById(resourceId: number): Promise<ApiResponse<ResourceSummary>> {
        return apiClient.get<ApiResponse<ResourceSummary>>(`${RESOURCES_API_BASE_URL}/${resourceId}`);
    },

    async getResourcesBySubjectOffering(offeringId: number): Promise<ApiResponse<ResourceSummary[]>> {
        const params = new URLSearchParams({
            offeringId: offeringId.toString()
        });
        return apiClient.get<ApiResponse<ResourceSummary[]>>(`${RESOURCES_API_BASE_URL}?${params.toString()}`);
    },

    async getResourcesByUploader(uploaderId: number): Promise<ApiResponse<ResourceSummary[]>> {
        const params = new URLSearchParams({
            userId: uploaderId.toString()
        });
        return apiClient.get<ApiResponse<ResourceSummary[]>>(`${RESOURCES_API_BASE_URL}?${params.toString()}`);
    },
}
