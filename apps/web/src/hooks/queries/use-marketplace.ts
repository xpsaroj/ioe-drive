import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import { marketplaceApi, type GetListingsFilters } from '@/lib/api/marketplace-api';
import { meKeys } from './use-me';
import { moderationKeys } from './use-moderation';
import type { MarketplaceReportReasonInput, UpdateListingInput } from '@/lib/validators/marketplace';

export const marketplaceKeys = {
    all: ['marketplace-listings'] as const,
    byId: (id: number) => ['marketplace-listings', id] as const,
    // Called with no `page` to get a stable prefix for invalidating every page at once.
    browse: (filters?: Omit<GetListingsFilters, 'page' | 'limit'>, page?: number) => page === undefined
        ? ['marketplace-listings', 'browse', filters] as const
        : ['marketplace-listings', 'browse', filters, page] as const,
};

export function useListing(listingId: number) {
    return useQuery({
        queryKey: marketplaceKeys.byId(listingId),
        queryFn: async () => {
            const response = await marketplaceApi.getListingById(listingId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch listing');
            }
            return response.data;
        },
        enabled: !!listingId,
    });
}

export function useListings(filters?: Omit<GetListingsFilters, 'page' | 'limit'>, page: number = 1) {
    return useQuery({
        queryKey: marketplaceKeys.browse(filters, page),
        queryFn: async () => {
            const response = await marketplaceApi.getListings({ ...filters, page });
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch listings');
            }
            return { items: response.data, meta: response.meta };
        },
        placeholderData: keepPreviousData,
    });
}

export function useCreateListing() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await marketplaceApi.createListing(formData);
            if (!response.success) {
                throw new Error(response.error || 'Failed to create listing');
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
            queryClient.invalidateQueries({ queryKey: meKeys.myMarketplaceListings() });
        },
    });
}

export function useUpdateListing(listingId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateListingInput) => {
            const response = await marketplaceApi.updateListing(listingId, data);
            if (!response.success) {
                throw new Error(response.error || 'Failed to update listing');
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: marketplaceKeys.byId(listingId) });
            queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
            queryClient.invalidateQueries({ queryKey: meKeys.myMarketplaceListings() });
        },
    });
}

export function useDeleteListing() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (listingId: number) => {
            const response = await marketplaceApi.deleteListing(listingId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to delete listing');
            }
            return response;
        },
        onSuccess: (_response, listingId) => {
            queryClient.removeQueries({ queryKey: marketplaceKeys.byId(listingId) });
            queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
            queryClient.invalidateQueries({ queryKey: meKeys.myMarketplaceListings() });
        },
    });
}

function invalidateAfterStatusChange(queryClient: ReturnType<typeof useQueryClient>, listingId: number) {
    queryClient.invalidateQueries({ queryKey: marketplaceKeys.byId(listingId) });
    queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
    queryClient.invalidateQueries({ queryKey: meKeys.myMarketplaceListings() });
}

/** Owner marks their own listing as sold/found - stays visible directly, hidden from default browse. */
export function useMarkListingFulfilled(listingId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await marketplaceApi.markFulfilled(listingId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to mark listing as fulfilled');
            }
            return response;
        },
        onSuccess: () => invalidateAfterStatusChange(queryClient, listingId),
    });
}

/** Undoes mark-fulfilled - back to ACTIVE and visible in the default browse again. */
export function useReactivateListing(listingId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await marketplaceApi.reactivateListing(listingId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to reactivate listing');
            }
            return response;
        },
        onSuccess: () => invalidateAfterStatusChange(queryClient, listingId),
    });
}

export function useAddListingPhotos(listingId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await marketplaceApi.addListingPhotos(listingId, formData);
            if (!response.success) {
                throw new Error(response.error || 'Failed to add photos');
            }
            return response;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: marketplaceKeys.byId(listingId) }),
    });
}

export function useRemoveListingPhoto(listingId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (photoId: number) => {
            const response = await marketplaceApi.removeListingPhoto(listingId, photoId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to remove photo');
            }
            return response;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: marketplaceKeys.byId(listingId) }),
    });
}

/** Stays live until a moderator reviews the report. */
export function useReportListing(listingId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: MarketplaceReportReasonInput) => {
            const response = await marketplaceApi.reportListing(listingId, data);
            if (!response.success) {
                throw new Error(response.error || 'Failed to report listing');
            }
            return response;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: moderationKeys.marketplaceReports() }),
    });
}

/** Moderator-only: purges photos and marks the listing permanently removed. */
export function useRemoveListingAsModerator(listingId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: MarketplaceReportReasonInput) => {
            const response = await marketplaceApi.removeListingAsModerator(listingId, data);
            if (!response.success) {
                throw new Error(response.error || 'Failed to remove listing');
            }
            return response;
        },
        onSuccess: () => {
            invalidateAfterStatusChange(queryClient, listingId);
            queryClient.invalidateQueries({ queryKey: moderationKeys.marketplaceReports() });
        },
    });
}
