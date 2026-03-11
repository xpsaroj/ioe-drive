import { apiClient } from "./api-client";
import type { ApiResponse, Note, NoteWithFiles } from "@/types";
import type { UpdateNoteInput } from "../validators/notes";

const NOTES_API_BASE_URL = "/notes";

export const notesApi = {
    async createNote(formData: FormData): Promise<ApiResponse<Note>> {
        return apiClient.postForm<ApiResponse<Note>>(`${NOTES_API_BASE_URL}`, formData);
    },

    async updateNote(noteId: number, noteData: UpdateNoteInput): Promise<ApiResponse<Note>> {
        return apiClient.patch<ApiResponse<Note>>(`${NOTES_API_BASE_URL}/${noteId}`, noteData);
    },

    async getNoteById(noteId: number): Promise<ApiResponse<NoteWithFiles>> {
        return apiClient.get<ApiResponse<NoteWithFiles>>(`${NOTES_API_BASE_URL}/${noteId}`);
    },

    async getNotesBySubject(subjectId: number): Promise<ApiResponse<NoteWithFiles[]>> {
        const params = new URLSearchParams({
            subjectId: subjectId.toString()
        });
        return apiClient.get<ApiResponse<NoteWithFiles[]>>(`${NOTES_API_BASE_URL}?${params.toString()}`);
    },
}