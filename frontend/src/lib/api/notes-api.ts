import { apiClient } from "./api-client";
import type { ApiResponse, Note } from "@/types";
import type { CreateNoteInput, UpdateNoteInput } from "../validators/notes";

const NOTES_API_BASE_URL = "/notes";

export const notesApi = {
    async createNote(noteData: CreateNoteInput): Promise<ApiResponse<Note>> {
        return apiClient.post<ApiResponse<Note>>(`${NOTES_API_BASE_URL}`, noteData);
    },

    async updateNote(noteId: number, noteData: UpdateNoteInput): Promise<ApiResponse<Note>> {
        return apiClient.patch<ApiResponse<Note>>(`${NOTES_API_BASE_URL}/${noteId}`, noteData);
    }
}