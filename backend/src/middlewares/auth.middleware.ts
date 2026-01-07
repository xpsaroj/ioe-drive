import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { sendErrorResponse } from "../lib/response.js";

/**
 * Middleware to require authentication for protected routes.
 * Checks for a valid Clerk authentication token in the request headers.
 * If authenticated, proceeds to the next middleware/controller.
 * If not authenticated, responds with a 401 Unauthorized error.
 *
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return sendErrorResponse(res, "Authorization header missing", 401);
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return sendErrorResponse(res, "Token missing from Authorization header", 401);
        }

        const { userId, isAuthenticated } = getAuth(req);

        if (!isAuthenticated || !userId) {
            return sendErrorResponse(res, "User not authenticated", 401);
        }

        const user = await db
            .query.usersTable
            .findFirst({
                where: eq(usersTable.clerkUserId, userId),
                columns: {
                    id: true,
                    clerkUserId: true,
                }
            });

        if (!user) {
            return sendErrorResponse(res, "User not registered in database", 401);
        }

        req.authUser = user;

        next();
    } catch (error) {
        console.error("API authentication error:", error);
        return sendErrorResponse(res, "Internal server error", 500);
    }
}