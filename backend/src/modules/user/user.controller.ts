import type { Request, Response, NextFunction } from "express";

import { userService } from "./user.service.js";
import { sendSuccessResponse } from "../../lib/response.js";

/**
 * User Controller
 * - Handles HTTP requests related to users.
 */
export class UserController {
    /**
     * Get a user's profile by ID.
     * - GET /api/users/:userId
     */
    async getUserProfileById(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = Number(req.params.userId);

            const userProfile = await userService.getUserProfileById(userId);
            return sendSuccessResponse(res, userProfile);
        } catch (e) {
            next(e);
        }
    }
}

export const userController = new UserController();