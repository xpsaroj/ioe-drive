import type { Request, Response } from "express";

import { usersTable } from "../db/schema.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";

/**
 * Get a user's profile by ID.
 * @param req Request
 * @param res Response
 * @returns User profile JSON or 404 if not found or 500 on error
 */
export const getUserProfileById = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    try {
        const user = await db
            .query.usersTable
            .findFirst({
                where: eq(usersTable.id, Number(userId)),
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
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user,
        });
    } catch (e) {
        console.error("Error fetching user profile by ID:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};