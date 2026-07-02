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

    /**
     * Get note details by note ID.
     * - GET /api/notes/:noteId
     */
    async getNoteById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const noteId = Number(req.params.noteId);
            const note = await notesService.findNoteById(noteId);
            return sendSuccessResponse(res, note);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Get all notes filtered by subject offering ID or user ID.
     * - GET /api/notes?offeringId=<offeringId>&userId=<userId>
     */
    async getNotes(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const filters: { offeringId?: number; userId?: number } = {};

            if (req.query.offeringId) {
                filters.offeringId = Number(req.query.offeringId);
            }

            if (req.query.userId) {
                filters.userId = Number(req.query.userId);
            }

            const notes = await notesService.findNotes(filters);

            return sendSuccessResponse(res, notes);
        } catch (e) {
            next(e);
        }
    }
}

export const notesController = new NotesController();
