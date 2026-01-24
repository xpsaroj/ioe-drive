import { eq, and } from "drizzle-orm";

import { db } from "../../db/index.js";
import { notesTable } from "../../db/schema.js";
import type { CreateNoteInput, UpdateNoteInput } from "./notes.dto.js";

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
    async create(noteData: CreateNoteInput) {
        const [note] = await db
            .insert(notesTable)
            .values(noteData)
            .returning();

        // Todo: Write logic to add noteFiles data to the db
        return note;
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
}

export const notesRepository = new NotesRepository();