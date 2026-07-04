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

    async getCurrentUserUploadedResources(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            if (!userId) throw new UnauthorizedError("User not authenticated");

            const uploadedResources = await meService.getUploadedResources(userId);
            return sendSuccessResponse(res, uploadedResources);
        } catch (e) {
            next(e);
        }
    }

    async getCurrentUserRecentResources(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            if (!userId) throw new UnauthorizedError("User not authenticated");

            const recentResources = await meService.getRecentlyAccessedResources(userId);
            return sendSuccessResponse(res, recentResources);
        } catch (e) {
            next(e);
        }
    }

    async getCurrentUserBookmarkedResources(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            if (!userId) throw new UnauthorizedError("User not authenticated");

            const bookmarkedResources = await meService.getBookmarkedResources(userId);
            return sendSuccessResponse(res, bookmarkedResources);
        } catch (e) {
            next(e);
        }
    }

    async markResourceAsRecentlyAccessed(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            const resourceId = Number(req.params.resourceId);
            if (!userId) throw new UnauthorizedError("User not authenticated");

            await meService.markResourceAsRecentlyAccessed(userId, resourceId);
            return sendSuccessResponse(res, null, "Resource marked as recently accessed");
        } catch (e) {
            next(e);
        }
    }

    async markResourceAsBookmarked(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            const resourceId = Number(req.params.resourceId);
            if (!userId) throw new UnauthorizedError("User not authenticated");

            await meService.markResourceAsBookmarked(userId, resourceId);
            return sendSuccessResponse(res, null, "Resource bookmarked");
        } catch (e) {
            next(e);
        }
    }

    async unmarkResourceAsBookmarked(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.authUser?.id;
            const resourceId = Number(req.params.resourceId);
            if (!userId) throw new UnauthorizedError("User not authenticated");

            await meService.unmarkResourceAsBookmarked(userId, resourceId);
            return sendSuccessResponse(res, null, "Resource unbookmarked");
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
            await meService.updateProfile(userId, validatedData);

            return sendSuccessResponse(res, null, "Profile updated successfully");
        } catch (e) {
            next(e);
        }
    }
}

export const meController = new MeController();
