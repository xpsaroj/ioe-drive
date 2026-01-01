import type { Request, Response } from "express";

import { usersTable } from "../db/schema.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { sendSuccessResponse, sendErrorResponse } from "../lib/response.js";

/**
 * Get a user's profile by ID.
 * @param req Request
 * @param res Response
 * @returns User profile JSON or 404 if not found or 500 on error
 */
export const getUserProfileById = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);

    try {
        const user = await db
            .query.usersTable
            .findFirst({
                where: eq(usersTable.id, userId),
                columns: {
                    id: true,
                    fullName: true,
                    createdAt: true,
                },
                with: {
                    profile: {
                        columns: {
                            id: true,
                            userId: true,
                            bio: true,
                            departmentId: true,
                            semester: true,
                            college: true,
                            profilePictureUrl: true,
                            createdAt: true,
                        },
                        with: {
                            department: true,
                        }
                    },
                }
            });

        if (!user) {
            return sendErrorResponse(res, "User not found", 404);
        }

        return sendSuccessResponse(res, user);
    } catch (e) {
        console.error("Error fetching user profile by ID:", e);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};