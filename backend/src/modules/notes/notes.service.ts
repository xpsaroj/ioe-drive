import { notesRepository } from "./notes.repository.js";
import type { CreateNoteInput, UpdateNoteInput } from "./notes.dto.js";
import { generateBlobName, uploadToAzure } from "../../utils/azure.js";

/**
 * Notes Service
 * - Contains business logic related to notes.
 */
export class NotesService {
    /**
     * Create a new note.
     * @param userId - ID of the user creating the note.
     * @param noteData - Data for the new note.
     * @returns The created note.
     */
    async createNote(userId: number, noteData: Omit<CreateNoteInput, 'uploadedBy'>, noteFiles: Express.Multer.File[]) {
        const noteToCreate = {
            ...noteData,
            uploadedBy: userId,
        };

        const uploadedFiles = await Promise.all(
            noteFiles.map(async (file) => {
                const blobName = await generateBlobName(file.originalname);

                const fileUrl = await uploadToAzure(
                    file.buffer,
                    blobName,
                    file.mimetype
                );

                return {
                    blobName,
                    url: fileUrl,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                }
            })
        )

        return await notesRepository.create(noteToCreate, uploadedFiles);
    }

    /**
     * Update an existing note.
     * @param userId - ID of the user updating the note.
     * @param noteId - ID of the note to update.
     * @param updateData - Data to update the note with.
     * @returns The updated note.
     */
    async updateNote(userId: number, noteId: number, updateData: UpdateNoteInput) {
        return await notesRepository.update(noteId, userId, updateData);
    }
}

export const notesService = new NotesService();