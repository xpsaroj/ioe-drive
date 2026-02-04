import type { NextFunction, Request, Response } from "express";

import { notesService } from "./notes.service.js";
import { sendSuccessResponse } from "../../lib/response.js";
import { UnauthorizedError } from "../../lib/errors.js";
import type { CreateNoteInput, UpdateNoteInput } from "./notes.dto.js";

/**
 * Notes Controller
 * - Handles HTTP requests related to notes.
 */
export class NotesController {
    /**
     * Create a new note.
     * - POST /api/notes
     */
    async createNote(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            const noteData: Omit<CreateNoteInput, 'uploadedBy'> = req.body;
            const noteFiles = req.files as Express.Multer.File[];

            const createdNote = await notesService.createNote(userId, noteData, noteFiles);
            return sendSuccessResponse(res, createdNote, "Note created successfully", 201);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Update an existing note.
     * - PATCH /api/notes/:noteId
     */
    async updateNote(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            const noteId = Number(req.params.noteId);
            const updateData: UpdateNoteInput = req.body;

            const updatedNote = await notesService.updateNote(userId, noteId, updateData);
            return sendSuccessResponse(res, updatedNote, "Note updated successfully");
        } catch (e) {
            next(e);
        }
    }
}

export const notesController = new NotesController();
