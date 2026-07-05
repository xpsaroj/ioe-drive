import { apiClient } from "./api-client";
import { appendPaginationParams, type PaginationParams } from "./pagination";
import type { Resource } from "@/types/entities";
import type { ApiResponse, EmptyApiResponse, PaginatedApiResponse, ResourceSummary } from "@/types/api";
import type { UpdateResourceInput } from "../validators/resources";

const RESOURCES_API_BASE_URL = "/resources";

export const resourcesApi = {
    async createResource(formData: FormData): Promise<ApiResponse<Resource>> {
        return apiClient.postForm<ApiResponse<Resource>>(`${RESOURCES_API_BASE_URL}`, formData);
    },

    async updateResource(resourceId: number, resourceData: UpdateResourceInput): Promise<ApiResponse<Resource>> {
        return apiClient.patch<ApiResponse<Resource>>(`${RESOURCES_API_BASE_URL}/${resourceId}`, resourceData);
    },

    async deleteResource(resourceId: number): Promise<EmptyApiResponse> {
        return apiClient.delete<EmptyApiResponse>(`${RESOURCES_API_BASE_URL}/${resourceId}`);
    },

    async addResourceFiles(resourceId: number, formData: FormData): Promise<EmptyApiResponse> {
        return apiClient.postForm<EmptyApiResponse>(`${RESOURCES_API_BASE_URL}/${resourceId}/files`, formData);
    },

    async removeResourceFile(resourceId: number, fileId: number): Promise<EmptyApiResponse> {
        return apiClient.delete<EmptyApiResponse>(`${RESOURCES_API_BASE_URL}/${resourceId}/files/${fileId}`);
    },

    async getFileDownloadUrl(resourceId: number, fileId: number, forceDownload = false): Promise<ApiResponse<{ url: string }>> {
        const query = forceDownload ? "?download=true" : "";
        return apiClient.get<ApiResponse<{ url: string }>>(`${RESOURCES_API_BASE_URL}/${resourceId}/files/${fileId}/download-url${query}`);
    },

    async getResourceById(resourceId: number): Promise<ApiResponse<ResourceSummary>> {
        return apiClient.get<ApiResponse<ResourceSummary>>(`${RESOURCES_API_BASE_URL}/${resourceId}`);
    },

    async getResourcesBySubjectOffering(offeringId: number, pagination?: PaginationParams): Promise<PaginatedApiResponse<ResourceSummary>> {
        const params = new URLSearchParams({
            offeringId: offeringId.toString()
        });
        appendPaginationParams(params, pagination);
        return apiClient.get<PaginatedApiResponse<ResourceSummary>>(`${RESOURCES_API_BASE_URL}?${params.toString()}`);
    },

    async getResourcesByUploader(uploaderId: number, pagination?: PaginationParams): Promise<PaginatedApiResponse<ResourceSummary>> {
        const params = new URLSearchParams({
            userId: uploaderId.toString()
        });
        appendPaginationParams(params, pagination);
        return apiClient.get<PaginatedApiResponse<ResourceSummary>>(`${RESOURCES_API_BASE_URL}?${params.toString()}`);
    },
}
