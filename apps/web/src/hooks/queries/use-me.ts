import { useAuth } from '@clerk/nextjs';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import { meApi } from '@/lib/api/me-api';
import { academicsKeys } from './use-academics';
import type { Profile, UserProfile } from '@/types/entities';

export const meKeys = {
    all: ['me'] as const,
    user: ['me', 'user'] as const,
    // Called with no `page` to get a stable prefix for invalidating every page at once.
    uploadedResources: (page?: number) => page === undefined
        ? ['me', 'uploaded-resources'] as const
        : ['me', 'uploaded-resources', page] as const,
    recentResources: (page?: number) => page === undefined
        ? ['me', 'recent-resources'] as const
        : ['me', 'recent-resources', page] as const,
    bookmarkedResources: (page?: number) => page === undefined
        ? ['me', 'bookmarked-resources'] as const
        : ['me', 'bookmarked-resources', page] as const,
    bookmarkedResourceIds: ['me', 'bookmarked-resource-ids'] as const,
};

export function useMe() {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: meKeys.user,
        queryFn: async () => {
            const response = await meApi.getMyProfile();
            if (!response.success) {
                throw new Error(response.error ?? 'Failed to fetch user data.');
            }
            return response.data;
        },
        enabled: isSignedIn, // Only fetch if user is signed in
        staleTime: 20 * 60 * 1000, // Cache user data for 30 minutes
        gcTime: 30 * 60 * 1000,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (profileData: Partial<Omit<Profile, "id" | "userId">>) => meApi.updateMyProfile(profileData),

        // Optimistic update
        onMutate: async (newProfile) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: meKeys.user });

            // Snapshot previous value
            const previousProfile = queryClient.getQueryData<UserProfile>(meKeys.user);

            // Optimistically update
            queryClient.setQueryData<UserProfile>(meKeys.user, (old) =>
                old ? { ...old, profile: { ...old.profile, ...newProfile } } : old
            );

            return { previousProfile };
        },

        // Rollback if mutation fails
        onError: (_err, _newProfile, context) => {
            if (context?.previousProfile) {
                queryClient.setQueryData(meKeys.user, context.previousProfile);
            }
        },

        // Always refetch after mutation to sync with server
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: meKeys.user });
            queryClient.invalidateQueries({
                queryKey: [...academicsKeys.all, "subject-offerings"],
            });
        },
    });
}

export function useUploadedResources(page: number = 1) {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: meKeys.uploadedResources(page),
        queryFn: async () => {
            const response = await meApi.getUploadedResources({ page });
            if (!response.success) {
                throw new Error(response.error ?? 'Failed to fetch uploaded resources.');
            }
            return { items: response.data, meta: response.meta };
        },
        enabled: isSignedIn,
        placeholderData: keepPreviousData,
    });
}

export function useRecentResources(page: number = 1) {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: meKeys.recentResources(page),
        queryFn: async () => {
            const response = await meApi.getRecentResources({ page });
            if (!response.success) {
                throw new Error(response.error ?? 'Failed to fetch recent resources.');
            }
            return { items: response.data, meta: response.meta };
        },
        enabled: isSignedIn,
        placeholderData: keepPreviousData,
    });
}

export function useBookmarkedResources(page: number = 1) {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: meKeys.bookmarkedResources(page),
        queryFn: async () => {
            const response = await meApi.getBookmarkedResources({ page });
            if (!response.success) {
                throw new Error(response.error ?? 'Failed to fetch bookmarked resources.');
            }
            return { items: response.data, meta: response.meta };
        },
        enabled: isSignedIn,
        placeholderData: keepPreviousData,
    });
}

/**
 * Fetches every resource ID the current user has bookmarked, for cheap "is this
 * bookmarked" membership checks across many resources at once (e.g. a bookmark icon on
 * every ResourceCard) - see useBookmarkResource/useUnbookmarkResource below for how
 * this cache gets kept in sync with actual bookmark/unbookmark actions.
 */
export function useBookmarkedResourceIds() {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: meKeys.bookmarkedResourceIds,
        queryFn: async () => {
            const response = await meApi.getBookmarkedResourceIds();
            if (!response.success) {
                throw new Error(response.error ?? 'Failed to fetch bookmarked resource IDs.');
            }
            return response.data;
        },
        enabled: isSignedIn,
        // Bookmarks change far less often than resources get browsed, and the mutations
        // below explicitly invalidate this on any bookmark/unbookmark, so correctness
        // for our own actions doesn't depend on staleTime.
        staleTime: 30 * 60 * 1000,
        gcTime: 40 * 60 * 1000,
    });
}

export function useMarkResourceAsRecentlyAccessed() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (resourceId: string) => meApi.markResourceAsRecentlyAccessed(resourceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: meKeys.recentResources() });
        },
    });
}

export function useBookmarkResource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (resourceId: string) => meApi.markResourceAsBookmarked(resourceId),

        // Optimistically add to the ID set so a card's bookmark icon flips instantly,
        // instead of waiting on a round-trip + refetch.
        onMutate: async (resourceId) => {
            await queryClient.cancelQueries({ queryKey: meKeys.bookmarkedResourceIds });

            const previousIds = queryClient.getQueryData<number[]>(meKeys.bookmarkedResourceIds);

            queryClient.setQueryData<number[]>(meKeys.bookmarkedResourceIds, (old) =>
                old ? [...old, Number(resourceId)] : old
            );

            return { previousIds };
        },

        onError: (_err, _resourceId, context) => {
            if (context?.previousIds) {
                queryClient.setQueryData(meKeys.bookmarkedResourceIds, context.previousIds);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: meKeys.bookmarkedResourceIds });
            queryClient.invalidateQueries({ queryKey: meKeys.bookmarkedResources() });
        },
    });
}

export function useUnbookmarkResource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (resourceId: string) => meApi.unmarkResourceAsBookmarked(resourceId),

        onMutate: async (resourceId) => {
            await queryClient.cancelQueries({ queryKey: meKeys.bookmarkedResourceIds });

            const previousIds = queryClient.getQueryData<number[]>(meKeys.bookmarkedResourceIds);

            queryClient.setQueryData<number[]>(meKeys.bookmarkedResourceIds, (old) =>
                old ? old.filter((id) => id !== Number(resourceId)) : old
            );

            return { previousIds };
        },

        onError: (_err, _resourceId, context) => {
            if (context?.previousIds) {
                queryClient.setQueryData(meKeys.bookmarkedResourceIds, context.previousIds);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: meKeys.bookmarkedResourceIds });
            queryClient.invalidateQueries({ queryKey: meKeys.bookmarkedResources() });
        },
    });
}
