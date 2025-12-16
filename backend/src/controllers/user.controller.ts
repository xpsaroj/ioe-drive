import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";

import { usersTable, userRecentNotesTable, userArchivedNotesTable, notesTable } from "../db/schema.js";
import { db } from "../db/index.js";
import { desc, eq } from "drizzle-orm";

/**
 * Get the currently authenticated user's profile.
 * @param req Request
 * @param res Response
 * @returns User profile JSON or 404 if not found
 */
export const getCurrentUserProfile = async (req: Request, res: Response) => {
    const userId = getAuth(req).userId as string;
    const user = await db
        .query.usersTable
        .findFirst({
            where: eq(usersTable.clerkUserId, userId),
            with: {
                profile: {
                    with: {
                        department: true,
                    }
                },
            }
        })

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
};

/**
 * Get a user's profile by ID.
 * @param req Request
 * @param res Response
 * @returns User profile JSON or 404 if not found
 */
export const getUserProfileById = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    const user = await db
        .query.usersTable
        .findFirst({
            where: eq(usersTable.id, Number(userId)),
            with: {
                profile: {
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
};

/**
 * Get all notes uploaded by a user.
 * @param req Request
 * @param res Response
 * @returns Notes uploaded by the user or 400 if userId is missing
 */
export const getUserUploadedNotes = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    const notes = await db
        .query.notesTable
        .findMany({
            where: eq(notesTable.uploadedBy, Number(userId)),
            with: {
                subject: {
                    with: {
                        department: true,
                    }
                },
                uploader: true,
            }
        });

    // Sanitize uploader info
    const notesSanitized = notes.map(({ uploader, ...noteRest }) => {
        const { id, fullName } = uploader;

        return {
            ...noteRest,
            uploader: { id, fullName },
        };
    });

    res.json({
        success: true,
        notes: notesSanitized,
    });
};

/**
 * Get notes recently accessed by a user.
 * @param req Request
 * @param res Response
 * @returns Recently accessed notes or 400 if userId is missing
 */
export const getUserRecentlyAccessedNotes = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    const notes = await db
        .query.userRecentNotesTable
        .findMany({
            where: eq(userRecentNotesTable.userId, Number(userId)),
            with: {
                note: {
                    with: {
                        subject: {
                            with: {
                                department: true,
                            }
                        },
                        uploader: true,
                    }
                }
            },
            orderBy: [desc(userRecentNotesTable.accessedAt)],
            limit: 5,
        });

    // Sanitize uploader info
    const notesSanitized = notes.map(entry => {
        const { id, fullName, ..._uploaderRest } = entry.note.uploader;
        return {
            ...entry,
            note: {
                ...entry.note,
                uploader: {
                    id, fullName,
                },
            },
        }
    });

    res.json({
        success: true,
        notes: notesSanitized,
    });
};

/**
 * Get notes bookmarked/archived by a user.
 * @param req Request
 * @param res Response
 * @returns Archived notes or 400 if userId is missing
 */
export const getUserArchivedNotes = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    const notes = await db
        .query.userArchivedNotesTable
        .findMany({
            where: eq(userArchivedNotesTable.userId, Number(userId)),
            with: {
                note: {
                    with: {
                        subject: {
                            with: {
                                department: true,
                            }
                        },
                        uploader: true,
                    }
                }
            },
            orderBy: [desc(userArchivedNotesTable.archivedAt)],
            limit: 10,
        });

    // Sanitize uploader info
    const notesSanitized = notes.map(entry => {
        const { id, fullName, ..._uploaderRest } = entry.note.uploader;
        return {
            ...entry,
            note: {
                ...entry.note,
                uploader: {
                    id, fullName,
                },
            },
        }
    });

    res.json({
        success: true,
        notes: notesSanitized,
    });
};