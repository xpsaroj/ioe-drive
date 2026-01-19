import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { UnauthorizedError } from "../lib/errors.js";

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
            throw new UnauthorizedError("Authorization header missing");
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new UnauthorizedError("Token missing from Authorization header");
        }

        const { userId, isAuthenticated } = getAuth(req);

        if (!isAuthenticated || !userId) {
            throw new UnauthorizedError("User not authenticated");
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
            throw new UnauthorizedError("User not registered in database");
        }

        req.authUser = user;

        next();
    } catch (error) {
        next(error);
    }
}