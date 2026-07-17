import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import { moderationApi } from '@/lib/api/moderation-api';

export const moderationKeys = {
    all: ['moderation'] as const,
    // Called with no `page` to get a stable prefix for invalidating every page at once.
    pending: (page?: number) => page === undefined
        ? ['moderation', 'pending'] as const
        : ['moderation', 'pending', page] as const,
    resourceReports: (page?: number) => page === undefined
        ? ['moderation', 'resource-reports'] as const
        : ['moderation', 'resource-reports', page] as const,
    marketplaceReports: (page?: number) => page === undefined
        ? ['moderation', 'marketplace-reports'] as const
        : ['moderation', 'marketplace-reports', page] as const,
};

/** The review queue: resources awaiting a moderator's decision, oldest first. */
export function usePendingResources(page: number = 1) {
    return useQuery({
        queryKey: moderationKeys.pending(page),
        queryFn: async () => {
            const response = await moderationApi.getPendingResources({ page });
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch pending resources');
            }
            return { items: response.data, meta: response.meta };
        },
        placeholderData: keepPreviousData,
    });
}

/** Open reports against already-approved resources. */
export function useResourceReports(page: number = 1) {
    return useQuery({
        queryKey: moderationKeys.resourceReports(page),
        queryFn: async () => {
            const response = await moderationApi.getResourceReports({ page });
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch reports');
            }
            return { items: response.data, meta: response.meta };
        },
        placeholderData: keepPreviousData,
    });
}

/** Closes a report with no change to the resource - the "unfounded report" case. */
export function useDismissResourceReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reportId: number) => {
            const response = await moderationApi.dismissResourceReport(reportId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to dismiss report');
            }
            return response;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: moderationKeys.resourceReports() }),
    });
}

/** Open reports against marketplace listings. */
export function useMarketplaceReports(page: number = 1) {
    return useQuery({
        queryKey: moderationKeys.marketplaceReports(page),
        queryFn: async () => {
            const response = await moderationApi.getMarketplaceReports({ page });
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch marketplace reports');
            }
            return { items: response.data, meta: response.meta };
        },
        placeholderData: keepPreviousData,
    });
}

/** Closes a marketplace report with no change to the listing - the "unfounded report" case. */
export function useDismissMarketplaceReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reportId: number) => {
            const response = await moderationApi.dismissMarketplaceReport(reportId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to dismiss report');
            }
            return response;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: moderationKeys.marketplaceReports() }),
    });
}
