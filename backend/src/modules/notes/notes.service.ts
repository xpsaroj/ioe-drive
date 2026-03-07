import { notesRepository } from "./notes.repository.js";
import type { CreateNoteInput, UpdateNoteInput } from "./notes.dto.js";
import { generateBlobName, uploadToAzure } from "../../utils/azure.js";
import { NotFoundError } from "../../lib/errors.js";
import { db } from "../../db/index.js";

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
        const existingSubject = await db
            .query.subjectsTable
            .findFirst({
                where: (fields, { eq }) => eq(fields.id, noteData.subjectId),
                columns: {
                    id: true,
                }
            })

        if (!existingSubject) {
            throw new NotFoundError("Subject not found");
        }

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
        const existingNote = await notesRepository.findById(noteId);

        if (!existingNote) {
            throw new NotFoundError("Note not found");
        }

        if (existingNote.uploadedBy !== userId) {
            throw new NotFoundError("Note not found");
        }

        return await notesRepository.update(noteId, userId, updateData);
    }

    /**
     * Find a note by its ID.
     * @param noteId - ID of the note to find.
     * @returns The found note.
     */
    async findNoteById(noteId: number) {
        const note = await notesRepository.findById(noteId);

        if (!note) {
            throw new NotFoundError("Note not found");
        }

        return note;
    }

    /**
     * Find notes by subject ID.
     * @param subjectId - ID of the subject to find notes for.
     * @returns An array of notes for the given subject ID.
     */
    async findNotesBySubjectId(subjectId: number) {
        return await notesRepository.findBySubjectId(subjectId);
    }
}

export const notesService = new NotesService();