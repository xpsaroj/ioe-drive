import type { Request, Response, NextFunction } from 'express';

import { meService } from './me.service.js';
import { UnauthorizedError } from '../../lib/errors.js';
import { sendSuccessResponse } from '../../lib/response.js';

/**
 * Me Controller
 * - Handles HTTP requests related to the currently authenticated user.
 */
export class MeController {
    /**
     * Get the currently authenticated user's profile.
     * - GET /api/me
     */
    async getCurrentUserProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            const userProfile = await meService.getProfile(userId);
            return sendSuccessResponse(res, userProfile);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Get all notes uploaded by the current user.
     * - GET /api/me/notes
     */
    async getCurrentUserUploadedNotes(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            const uploadedNotes = await meService.getUploadedNotes(userId);
            return sendSuccessResponse(res, uploadedNotes);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Get recent notes accessed by the current user.
     * - GET /api/me/recent-notes
     */
    async getCurrentUserRecentNotes(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            const recentNotes = await meService.getRecentlyAccessedNotes(userId);
            return sendSuccessResponse(res, recentNotes);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Get archived notes of the current user.
     * - GET /api/me/archived-notes
     */
    async getCurrentUserArchivedNotes(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            const archivedNotes = await meService.getArchivedNotes(userId);
            return sendSuccessResponse(res, archivedNotes);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Mark a note as recently accessed by the current user.
     * - POST /api/me/notes/:noteId/recent
     */
    async markNoteAsRecentlyAccessed(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;
            const noteId = Number(req.params.noteId);

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            await meService.markNoteAsRecentlyAccessed(userId, noteId);
            return sendSuccessResponse(res, null, "Note marked as recently accessed");
        } catch (e) {
            next(e);
        }
    }

    /**
     * Mark a note as archived by the current user.
     * - POST /api/me/notes/:noteId/archive
     */
    async markNoteAsArchived(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;
            const noteId = Number(req.params.noteId);

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            await meService.markNoteAsArchived(userId, noteId);
            return sendSuccessResponse(res, null, "Note marked as archived");
        } catch (e) {
            next(e);
        }
    }

    /**
     * Unmark a note as archived by the current user.
     * - DELETE /api/me/notes/:noteId/archive
     */
    async unmarkNoteAsArchived(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.authUser?.id;
            const noteId = Number(req.params.noteId);

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            await meService.unmarkNoteAsArchived(userId, noteId);
            return sendSuccessResponse(res, null, "Note unmarked as archived");
        } catch (e) {
            next(e);
        }
    }
}

export const meController = new MeController();