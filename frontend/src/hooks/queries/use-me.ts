import { useAuth } from '@clerk/nextjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { meApi } from '@/lib/api/me-api';
import { academicsKeys } from './use-academics';
import type { Profile, UserProfile } from '@/types';

export const meKeys = {
    all: ['me'] as const,
    user: ['me', 'user'] as const,
    uploadedNotes: ['me', 'uploaded-notes'] as const,
    recentNotes: ['me', 'recent-notes'] as const,
    archivedNotes: ['me', 'archived-notes'] as const,
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

export function useUploadedNotes() {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: meKeys.uploadedNotes,
        queryFn: async () => {
            const response = await meApi.getUploadedNotes();
            if (!response.success) {
                throw new Error(response.error ?? 'Failed to fetch uploaded notes.');
            }
            return response.data;
        },
        enabled: isSignedIn,
    });
}

export function useRecentNotes() {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: meKeys.recentNotes,
        queryFn: async () => {
            const response = await meApi.getRecentNotes();
            if (!response.success) {
                throw new Error(response.error ?? 'Failed to fetch recent notes.');
            }
            return response.data;
        },
        enabled: isSignedIn,
    });
}

export function useArchivedNotes() {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: meKeys.archivedNotes,
        queryFn: async () => {
            const response = await meApi.getArchivedNotes();
            if (!response.success) {
                throw new Error(response.error ?? 'Failed to fetch archived notes.');
            }
            return response.data;
        },
        enabled: isSignedIn,
    });
}

export function useArchiveNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (noteId: string) => meApi.markNoteAsArchived(noteId),
        onSuccess: () => {
            // Invalidate archived notes to refetch
            queryClient.invalidateQueries({ queryKey: meKeys.archivedNotes });
        },
    });
}

export function useUnarchiveNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (noteId: string) => meApi.unmarkNoteAsArchived(noteId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: meKeys.archivedNotes });
        },
    });
}