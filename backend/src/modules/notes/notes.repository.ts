import { eq, and } from "drizzle-orm";

import { db } from "../../db/index.js";
import { noteFilesTable, notesTable } from "../../db/schema.js";
import type { CreateNoteInput, UpdateNoteInput } from "./notes.dto.js";
import type { FileMetaData } from "../../types/file.js";

/**
 * Notes Repository
 * - Handles all database operations related to notes.
 */
export class NotesRepository {
    /**
     * Create a new note in the database.
     * @param noteData - Data for the new note.
     * @returns The created note.
     */
    async create(noteData: CreateNoteInput, files: FileMetaData[]) {
        return await db.transaction(async (tx) => {
            const [createdNote] = await tx
                .insert(notesTable)
                .values(noteData)
                .returning();

            if (!createdNote) {
                throw new Error("Failed to create note");
            }

            if (files.length > 0) {
                await tx
                    .insert(noteFilesTable)
                    .values(
                        files.map((file) => ({
                            noteId: createdNote.id,
                            fileUrl: file.url,
                            fileSize: file.size,
                            blobName: file.blobName,
                            originalFileName: file.originalName,
                            mimeType: file.mimeType,
                        }))
                    )
            }
            return createdNote;
        })
    }

    /**
     * Update an existing note in the database.
     * @param noteId - ID of the note to update.
     * @param userId - ID of the user updating the note.
     * @param updateData - Data to update the note with.
     * @returns The updated note.
     */
    async update(noteId: number, userId: number, updateData: UpdateNoteInput) {
        const [updatedNote] = await db
            .update(notesTable)
            .set(updateData)
            .where(
                and(
                    eq(notesTable.id, noteId),
                    eq(notesTable.uploadedBy, userId)
                )
            )
            .returning();
        return updatedNote;
    }

    /**
     * Find a note by its ID.
     * @param noteId - ID of the note to find.
     * @returns The found note or undefined.
     */
    async findById(noteId: number) {
        return await db
            .query
            .notesTable
            .findFirst({
                where: eq(notesTable.id, noteId),
                with: {
                    files: true,
                }
            });
    }

    /**
     * Find notes by subject ID.
     * @param subjectId - ID of the subject to find notes for.
     * @returns An array of notes for the given subject ID.
     */
    async findBySubjectId(subjectId: number) {
        return await db
            .query
            .notesTable
            .findMany({
                where: eq(notesTable.subjectId, subjectId),
                with: {
                    files: true,
                }
            });
    }
}

export const notesRepository = new NotesRepository();