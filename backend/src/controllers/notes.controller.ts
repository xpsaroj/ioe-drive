import type { NextFunction, Request, Response } from "express";

import { db } from "../db/index.js";
import { notesTable } from "../db/schema.js";
import { sendSuccessResponse } from "../lib/response.js";
import type { CreateNoteInput, UpdateNoteInput } from "../schemas/notes.schema.js";
import { and, eq } from "drizzle-orm";

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.authUser!.id;
    const { title, description, subjectId } = req.body as CreateNoteInput;

    try {
        const uploadedNote = await db.transaction(async (tx) => {
            const [note] = await tx
                .insert(notesTable)
                .values({
                    title,
                    description,
                    subjectId,
                    uploadedBy: Number(userId),
                })
                .returning();

            return note;
            // To-do: Write logic to add noteFiles data to the db 
        })

        return sendSuccessResponse(res, uploadedNote, "Note created successfully", 201);
    } catch (e) {
        next(e);
    }
}

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.authUser!.id;
    const noteId = Number(req.params.noteId);
    const { title, description, subjectId } = req.body as UpdateNoteInput;

    try {
        const [updatedNote] = await db
            .update(notesTable)
            .set({
                title,
                description,
                subjectId,
            })
            .where(
                and(
                    eq(notesTable.id, noteId),
                    eq(notesTable.uploadedBy, Number(userId))
                )
            )
            .returning()

        return sendSuccessResponse(res, updatedNote, "Note updated successfully");
    } catch (e) {
        next(e);
    }
}