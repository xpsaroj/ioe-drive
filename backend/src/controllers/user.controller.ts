import type { Request, Response, NextFunction } from "express";

import { usersTable } from "../db/schema.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { sendSuccessResponse } from "../lib/response.js";
import { NotFoundError } from "../lib/errors.js";

/**
 * Get a user's profile by ID.
 * @param req Request
 * @param res Response
 * @returns User profile JSON or 404 if not found or 500 on error
 */
export const getUserProfileById = async (req: Request, res: Response, next: NextFunction) => {
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
            throw new NotFoundError("User not found");
        }

        return sendSuccessResponse(res, user);
    } catch (e) {
        next(e);
    }
};