import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi } from '@/lib/api/resources-api';
import type { UpdateResourceInput } from '@/lib/validators/resources';

export const resourcesKeys = {
    all: ['resources'] as const,
    byId: (id: number) => ['resources', id] as const,
    bySubjectOfferingId: (offeringId?: number) => ['resources', 'subject-offering', offeringId] as const,
    byUploaderId: (uploaderId?: number) => ['resources', 'uploader', uploaderId] as const,
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
            // Update the specific resource in cache
            if (!response.success) {
                throw new Error(response.error || 'Failed to update resource');
            }
            queryClient.setQueryData(resourcesKeys.byId(resourceId), response.data);
            // Invalidate list queries
            queryClient.invalidateQueries({ queryKey: resourcesKeys.all });
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
