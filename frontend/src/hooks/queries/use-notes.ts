import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '@/lib/api/notes-api';
import type { CreateNoteInput, UpdateNoteInput } from '@/lib/validators/notes';

export const notesKeys = {
    all: ['notes'] as const,
    byId: (id: number) => ['notes', id] as const,
    bySubjectId: (subjectId: number) => ['notes', 'subject', subjectId] as const,
};

export function useNote(noteId: number) {
    return useQuery({
        queryKey: notesKeys.byId(noteId),
        queryFn: async () => {
            const response = await notesApi.getNoteById(noteId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch note');
            }
            return response.data;
        },
    });
}

export function useNotesBySubjectId(subjectId: number) {
    return useQuery({
        queryKey: notesKeys.bySubjectId(subjectId),
        queryFn: async () => {
            const response = await notesApi.getNotesBySubject(subjectId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch notes for subject');
            }
            return response.data;
        },
        // Public data - can be accessed without auth
        staleTime: 10 * 60 * 1000, // 10 minutes for public data
    });
}

export function useCreateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (noteData: CreateNoteInput) => notesApi.createNote(noteData),
        onSuccess: (response) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: notesKeys.all });
            if (response.success) {
                queryClient.invalidateQueries({
                    queryKey: notesKeys.bySubjectId(response.data.subjectId)
                });
            }
        },
    });
}

export function useUpdateNote(noteId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (noteData: UpdateNoteInput) =>
            notesApi.updateNote(noteId, noteData),
        onSuccess: (response) => {
            // Update the specific note in cache
            if (!response.success) {
                throw new Error(response.error || 'Failed to update note');
            }
            queryClient.setQueryData(notesKeys.byId(noteId), response.data);
            // Invalidate list queries
            queryClient.invalidateQueries({ queryKey: notesKeys.all });
        },
    });
}