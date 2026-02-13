import type { Request, Response, NextFunction } from 'express';
import { meService } from './me.service.js';
import { UnauthorizedError } from '../../lib/errors.js';
import { sendSuccessResponse } from '../../lib/response.js';
import { type UpdateProfileInput } from './me.dto.js';

/**
 * Me Controller
 * - Handles HTTP requests related to the currently authenticated user.
 */
export class MeController {
    async getCurrentUserProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            if (!userId) throw new UnauthorizedError("User not authenticated");

            const userProfile = await meService.getProfile(userId);
            return sendSuccessResponse(res, userProfile);
        } catch (e) {
            next(e);
        }
    }

    async getCurrentUserUploadedNotes(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            if (!userId) throw new UnauthorizedError("User not authenticated");

            const uploadedNotes = await meService.getUploadedNotes(userId);
            return sendSuccessResponse(res, uploadedNotes);
        } catch (e) {
            next(e);
        }
    }

    async getCurrentUserRecentNotes(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            if (!userId) throw new UnauthorizedError("User not authenticated");

            const recentNotes = await meService.getRecentlyAccessedNotes(userId);
            return sendSuccessResponse(res, recentNotes);
        } catch (e) {
            next(e);
        }
    }

    async getCurrentUserArchivedNotes(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            if (!userId) throw new UnauthorizedError("User not authenticated");

            const archivedNotes = await meService.getArchivedNotes(userId);
            return sendSuccessResponse(res, archivedNotes);
        } catch (e) {
            next(e);
        }
    }

    async markNoteAsRecentlyAccessed(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            const noteId = Number(req.params.noteId);
            if (!userId) throw new UnauthorizedError("User not authenticated");

            await meService.markNoteAsRecentlyAccessed(userId, noteId);
            return sendSuccessResponse(res, null, "Note marked as recently accessed");
        } catch (e) {
            next(e);
        }
    }

    async markNoteAsArchived(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            const noteId = Number(req.params.noteId);
            if (!userId) throw new UnauthorizedError("User not authenticated");

            await meService.markNoteAsArchived(userId, noteId);
            return sendSuccessResponse(res, null, "Note marked as archived");
        } catch (e) {
            next(e);
        }
    }

    async unmarkNoteAsArchived(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            const noteId = Number(req.params.noteId);
            if (!userId) throw new UnauthorizedError("User not authenticated");

            await meService.unmarkNoteAsArchived(userId, noteId);
            return sendSuccessResponse(res, null, "Note unmarked as archived");
        } catch (e) {
            next(e);
        }
    }

    /**
     * Update the currently authenticated user's profile.
     * - PATCH /api/me
     */
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            if (!userId) throw new UnauthorizedError("User not authenticated");

            const validatedData: UpdateProfileInput = req.body;
            const updatedProfile = await meService.updateProfile(userId, validatedData);

            return sendSuccessResponse(res, updatedProfile, "Profile updated successfully");
        } catch (e) {
            next(e);
        }
    }
}

export const meController = new MeController();
