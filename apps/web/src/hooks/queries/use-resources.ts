import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { resourcesApi } from '@/lib/api/resources-api';
import { meKeys } from './use-me';
import type { UpdateResourceInput } from '@/lib/validators/resources';

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
            // Invalidate list queries
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
