import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { usersTable } from "../db/schema.js";

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
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing from Authorization header"
            });
        }

        const { userId, isAuthenticated } = getAuth(req);

        if (!isAuthenticated || !userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            })
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
            return res.status(401).json({
                success: false,
                message: "User not registered in database"
            });
        }

        req.authUser = user;

        next();
    } catch (error) {
        console.error("API authentication error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication"
        });
    }
}