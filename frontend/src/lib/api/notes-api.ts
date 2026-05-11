import { apiClient } from "./api-client";
import type { Note } from "@/types/entities";
import type { ApiResponse, NoteCard } from "@/types/api";
import type { UpdateNoteInput } from "../validators/notes";

const NOTES_API_BASE_URL = "/notes";

export const notesApi = {
    async createNote(formData: FormData): Promise<ApiResponse<Note>> {
        return apiClient.postForm<ApiResponse<Note>>(`${NOTES_API_BASE_URL}`, formData);
    },

    async updateNote(noteId: number, noteData: UpdateNoteInput): Promise<ApiResponse<Note>> {
        return apiClient.patch<ApiResponse<Note>>(`${NOTES_API_BASE_URL}/${noteId}`, noteData);
    },

    async getNoteById(noteId: number): Promise<ApiResponse<NoteCard>> {
        return apiClient.get<ApiResponse<NoteCard>>(`${NOTES_API_BASE_URL}/${noteId}`);
    },

    async getNotesBySubjectOffering(offeringId: number): Promise<ApiResponse<NoteCard[]>> {
        const params = new URLSearchParams({
            offeringId: offeringId.toString()
        });
        return apiClient.get<ApiResponse<NoteCard[]>>(`${NOTES_API_BASE_URL}?${params.toString()}`);
    },
}