import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi } from '@/lib/api/resources-api';
import { meKeys } from './use-me';
import type { UpdateResourceInput } from '@/lib/validators/resources';

export const resourcesKeys = {
    all: ['resources'] as const,
    byId: (id: number) => ['resources', id] as const,
    bySubjectOfferingId: (offeringId?: number) => ['resources', 'subject-offering', offeringId] as const,
    byUploaderId: (uploaderId?: number) => ['resources', 'uploader', uploaderId] as const,
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

export function useResourcesBySubjectOfferingId(offeringId?: number) {
    return useQuery({
        queryKey: resourcesKeys.bySubjectOfferingId(offeringId),
        queryFn: async () => {
            if (!offeringId) {
                throw new Error('Subject Offering ID is required to fetch resources');
            }
            const response = await resourcesApi.getResourcesBySubjectOffering(offeringId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch resources for subject');
            }

            return response.data;
        },
        enabled: !!offeringId,
        staleTime: 10 * 60 * 1000,
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
            queryClient.invalidateQueries({ queryKey: meKeys.uploadedResources });
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
            queryClient.invalidateQueries({ queryKey: meKeys.uploadedResources });
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

/**
 * Fetches a short-lived signed URL to view/download a specific file. The URL expires
 * after a while (see the server's generateSasUrl), so this is deliberately never
 * treated as long-lived cache: refetchOnMount "always" guarantees a fresh, valid URL
 * every time the preview page (re)mounts, and staleTime 0 means it's never served
 * from cache without at least attempting a refetch.
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
        staleTime: 0,
        refetchOnMount: 'always',
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

export function useResourcesByUploaderId(uploaderId?: number) {
    return useQuery({
        queryKey: resourcesKeys.byUploaderId(uploaderId),
        queryFn: async () => {
            if (!uploaderId) {
                throw new Error('Uploader ID is required to fetch resources');
            }
            const response = await resourcesApi.getResourcesByUploader(uploaderId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch resources for uploader');
            }

            return response.data;
        },
        enabled: !!uploaderId,
        staleTime: 10 * 60 * 1000,
    });
}
