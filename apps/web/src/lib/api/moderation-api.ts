import { apiClient } from "./api-client";
import { appendPaginationParams, type PaginationParams } from "./pagination";
import type { EmptyApiResponse, PaginatedApiResponse, MarketplaceReportItem, ReportItem, ResourceSummary } from "@/types/api";

const MODERATION_API_BASE_URL = "/moderation";

export const moderationApi = {
    async getPendingResources(pagination?: PaginationParams): Promise<PaginatedApiResponse<ResourceSummary>> {
        const params = new URLSearchParams();
        appendPaginationParams(params, pagination);
        return apiClient.get<PaginatedApiResponse<ResourceSummary>>(`${MODERATION_API_BASE_URL}/pending?${params.toString()}`);
    },

    async getReports(pagination?: PaginationParams): Promise<PaginatedApiResponse<ReportItem>> {
        const params = new URLSearchParams();
        appendPaginationParams(params, pagination);
        return apiClient.get<PaginatedApiResponse<ReportItem>>(`${MODERATION_API_BASE_URL}/reports?${params.toString()}`);
    },

    async dismissReport(reportId: number): Promise<EmptyApiResponse> {
        return apiClient.post<EmptyApiResponse>(`${MODERATION_API_BASE_URL}/reports/${reportId}/dismiss`);
    },

    async getMarketplaceReports(pagination?: PaginationParams): Promise<PaginatedApiResponse<MarketplaceReportItem>> {
        const params = new URLSearchParams();
        appendPaginationParams(params, pagination);
        return apiClient.get<PaginatedApiResponse<MarketplaceReportItem>>(`${MODERATION_API_BASE_URL}/marketplace/reports?${params.toString()}`);
    },

    async dismissMarketplaceReport(reportId: number): Promise<EmptyApiResponse> {
        return apiClient.post<EmptyApiResponse>(`${MODERATION_API_BASE_URL}/marketplace/reports/${reportId}/dismiss`);
    },
}
