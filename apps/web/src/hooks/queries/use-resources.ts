import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { resourcesApi } from '@/lib/api/resources-api';
import { meKeys } from './use-me';
import { moderationKeys } from './use-moderation';
import type { ModerationReasonInput, UpdateResourceInput } from '@/lib/validators/resources';

export const resourcesKeys = {
    all: ['resources'] as const,
    byId: (id: number) => ['resources', id] as const,
    // Called with no `page` to get a stable prefix for invalidating every page at once.
    bySubjectOfferingId: (offeringId?: number, page?: number) => page === undefined
        ? ['resources', 'subject-offering', offeringId] as const
        : ['resources', 'subject-offering', offeringId, page] as const,
    byUploaderId: (uploaderId?: number, page?: number) => page === undefined
        ? ['resources', 'uploader', uploaderId] as const
        : ['resources', 'uploader', uploaderId, page] as const,
    fileDownloadUrl: (resourceId: number, fileId: number) => ['resources', resourceId, 'files', fileId, 'download-url'] as const,
    search: (q: string, page?: number) => page === undefined
        ? ['resources', 'search', q] as const
        : ['resources', 'search', q, page] as const,
    searchSuggestions: (q: string, limit?: number) => ['resources', 'search-suggestions', q, limit] as const,
    similar: (resourceId: number, limit?: number) => ['resources', resourceId, 'similar', limit] as const,
};

export function useResource(resourceId: number) {
    return useQuery({
        queryKey: resourcesKeys.byId(resourceId),
        queryFn: async () => {
            const response = await resourcesApi.getResourceById(resourceId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch resource');
            }
            return response.data;
        },
    });
}

export function useResourcesBySubjectOfferingId(offeringId?: number, page: number = 1) {
    return useQuery({
        queryKey: resourcesKeys.bySubjectOfferingId(offeringId, page),
        queryFn: async () => {
            if (!offeringId) {
                throw new Error('Subject Offering ID is required to fetch resources');
            }
            const response = await resourcesApi.getResourcesBySubjectOffering(offeringId, { page });
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch resources for subject');
            }

            return { items: response.data, meta: response.meta };
        },
        enabled: !!offeringId,
        staleTime: 10 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
}

export function useCreateResource() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await resourcesApi.createResource(formData);
            if (!response.success) {
                throw new Error(response.error || 'Failed to create resource');
            }
            return response;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: resourcesKeys.all });
            queryClient.invalidateQueries({
                queryKey: resourcesKeys.bySubjectOfferingId(response.data.offeringId)
            });
        },
    });
}

export function useUpdateResource(resourceId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (resourceData: UpdateResourceInput) =>
            resourcesApi.updateResource(resourceId, resourceData),
        onSuccess: (response) => {
            if (!response.success) {
                throw new Error(response.error || 'Failed to update resource');
            }
            // The PATCH response is just the bare updated row (no files/subjectOffering/
            // uploader joined in, unlike GET) - don't write it directly into the
            // full-detail cache slot, or anything reading resource.files/subjectOffering
            // off that cache will break until the next real refetch. Invalidate instead
            // so the next read refetches the complete shape.
            queryClient.invalidateQueries({ queryKey: resourcesKeys.byId(resourceId) });
            queryClient.invalidateQueries({ queryKey: resourcesKeys.all });
            // The edited resource may show up in the current user's uploads list too
            queryClient.invalidateQueries({ queryKey: meKeys.uploadedResources() });
        },
    });
}

export function useDeleteResource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (resourceId: number) => {
            const response = await resourcesApi.deleteResource(resourceId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to delete resource');
            }
            return response;
        },
        onSuccess: (_response, resourceId) => {
            queryClient.removeQueries({ queryKey: resourcesKeys.byId(resourceId) });
            queryClient.invalidateQueries({ queryKey: resourcesKeys.all });
            queryClient.invalidateQueries({ queryKey: meKeys.uploadedResources() });
        },
    });
}

export function useAddResourceFiles(resourceId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await resourcesApi.addResourceFiles(resourceId, formData);
            if (!response.success) {
                throw new Error(response.error || 'Failed to add files');
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resourcesKeys.byId(resourceId) });
        },
    });
}

export function useRemoveResourceFile(resourceId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (fileId: number) => {
            const response = await resourcesApi.removeResourceFile(resourceId, fileId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to remove file');
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resourcesKeys.byId(resourceId) });
        },
    });
}

// Keep a few minutes of safety margin below the server's actual SAS expiry
// (generateSasUrl's default `expiresInMinutes`, apps/server/src/utils/azure.ts) so a
// cached URL is always refetched well before it could actually go dead. gcTime is
// overridden alongside it (the global default is only 10 min) - gcTime below staleTime
// would evict the cache before it even has a chance to be reused.
const FILE_DOWNLOAD_URL_STALE_TIME = 13 * 60 * 1000;
const FILE_DOWNLOAD_URL_GC_TIME = 14 * 60 * 1000;

/**
 * Fetches a short-lived signed URL to view/download a specific file. staleTime is set
 * just under the server's actual SAS expiry (see the consts above) rather than 0, so
 * revisiting the same file shortly after (e.g. navigating back then re-opening it)
 * reuses the cached URL instead of hitting the backend and re-downloading the file from
 * Azure every time - while still guaranteeing a fresh URL is fetched well before the
 * cached one could actually expire.
 */
export function useFileDownloadUrl(resourceId: number, fileId?: number) {
    return useQuery({
        queryKey: resourcesKeys.fileDownloadUrl(resourceId, fileId ?? -1),
        queryFn: async () => {
            if (!fileId) {
                throw new Error('File ID is required to fetch a download URL');
            }
            const response = await resourcesApi.getFileDownloadUrl(resourceId, fileId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch download URL');
            }
            return response.data;
        },
        enabled: !!resourceId && !!fileId,
        staleTime: FILE_DOWNLOAD_URL_STALE_TIME,
        gcTime: FILE_DOWNLOAD_URL_GC_TIME,
    });
}

/**
 * Requests a forced-download (Content-Disposition: attachment) signed URL for a file,
 * on demand - only called when the user actually clicks "Download", rather than
 * generating one eagerly alongside the inline preview URL that most visits won't need.
 */
export function useDownloadFile(resourceId: number) {
    return useMutation({
        mutationFn: async (fileId: number) => {
            const response = await resourcesApi.getFileDownloadUrl(resourceId, fileId, true);
            if (!response.success) {
                throw new Error(response.error || 'Failed to get download link');
            }
            return response.data.url;
        },
    });
}

export function useResourcesByUploaderId(uploaderId?: number, page: number = 1) {
    return useQuery({
        queryKey: resourcesKeys.byUploaderId(uploaderId, page),
        queryFn: async () => {
            if (!uploaderId) {
                throw new Error('Uploader ID is required to fetch resources');
            }
            const response = await resourcesApi.getResourcesByUploader(uploaderId, { page });
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch resources for uploader');
            }

            return { items: response.data, meta: response.meta };
        },
        enabled: !!uploaderId,
        staleTime: 10 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
}

export const MIN_SEARCH_QUERY_LENGTH = 2;

export function useSearchResources(q: string, page: number = 1, limit?: number) {
    const trimmed = q.trim();

    return useQuery({
        queryKey: resourcesKeys.search(trimmed, page),
        queryFn: async () => {
            const response = await resourcesApi.searchResources(trimmed, { page, limit });
            if (!response.success) {
                throw new Error(response.error || 'Failed to search resources');
            }

            return { items: response.data, meta: response.meta };
        },
        enabled: trimmed.length >= MIN_SEARCH_QUERY_LENGTH,
        placeholderData: keepPreviousData,
    });
}

/** Lean, capped-list variant of useSearchResources for live-typing UI (the search
 * palette) - fetches search-suggestions previews instead of the full paginated
 * ResourceSummary shape. */
export function useSearchSuggestions(q: string, limit?: number) {
    const trimmed = q.trim();

    return useQuery({
        queryKey: resourcesKeys.searchSuggestions(trimmed, limit),
        queryFn: async () => {
            const response = await resourcesApi.searchSuggestions(trimmed, limit);
            if (!response.success) {
                throw new Error(response.error || 'Failed to search resources');
            }
            return response.data;
        },
        enabled: trimmed.length >= MIN_SEARCH_QUERY_LENGTH,
        placeholderData: keepPreviousData,
    });
}

/** Shared invalidation after any moderator action or a report - the resource's own
 * detail/browse caches, the uploader's own uploads list (so they see the new status
 * next time they check it), and the moderation queues (the resource may have just
 * left the pending list, or a report may have just been filed/resolved). */
function invalidateAfterModeration(queryClient: ReturnType<typeof useQueryClient>, resourceId: number) {
    queryClient.invalidateQueries({ queryKey: resourcesKeys.byId(resourceId) });
    queryClient.invalidateQueries({ queryKey: resourcesKeys.all });
    queryClient.invalidateQueries({ queryKey: meKeys.uploadedResources() });
    queryClient.invalidateQueries({ queryKey: moderationKeys.pending() });
    queryClient.invalidateQueries({ queryKey: moderationKeys.reports() });
}

/** Approves a pending resource, making it publicly visible (moderator-only). */
export function useApproveResource(resourceId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await resourcesApi.approveResource(resourceId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to approve resource');
            }
            return response;
        },
        onSuccess: () => invalidateAfterModeration(queryClient, resourceId),
    });
}

/** Rejects a pending or approved resource with a reason (moderator-only). Resubmittable
 * - the uploader editing it resets it back to pending. */
export function useRejectResource(resourceId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ModerationReasonInput) => {
            const response = await resourcesApi.rejectResource(resourceId, data);
            if (!response.success) {
                throw new Error(response.error || 'Failed to reject resource');
            }
            return response;
        },
        onSuccess: () => invalidateAfterModeration(queryClient, resourceId),
    });
}

/** The harder moderator action: purges the resource's files and marks it permanently
 * removed, with a reason the uploader can see on their own uploads page. */
export function useRemoveResource(resourceId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ModerationReasonInput) => {
            const response = await resourcesApi.removeResource(resourceId, data);
            if (!response.success) {
                throw new Error(response.error || 'Failed to remove resource');
            }
            return response;
        },
        onSuccess: () => invalidateAfterModeration(queryClient, resourceId),
    });
}

/** Reports an approved resource (any signed-in user other than its uploader) - stays
 * live until a moderator reviews the report. */
export function useReportResource(resourceId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ModerationReasonInput) => {
            const response = await resourcesApi.reportResource(resourceId, data);
            if (!response.success) {
                throw new Error(response.error || 'Failed to report resource');
            }
            return response;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: moderationKeys.reports() }),
    });
}

/** Other resources from the same subject offering as `resourceId` - backs the resource
 * detail page's "Similar Resources" panel. */
export function useSimilarResources(resourceId: number, limit?: number) {
    return useQuery({
        queryKey: resourcesKeys.similar(resourceId, limit),
        queryFn: async () => {
            const response = await resourcesApi.getSimilarResources(resourceId, limit);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch similar resources');
            }
            return response.data;
        },
        enabled: !!resourceId,
    });
}
