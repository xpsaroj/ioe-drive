import type { Request, Response, NextFunction } from "express";
import { desc, eq, and } from "drizzle-orm";

import { usersTable, userRecentNotesTable, userArchivedNotesTable, notesTable } from "../db/schema.js";
import { db } from "../db/index.js";
import { sendSuccessResponse } from "../lib/response.js";
import { NotFoundError } from "../lib/errors.js";

/**
 * Get the currently authenticated user's profile.
 * @param req Request
 * @param res Response
 * @returns User profile or 404 if not found or 500 on error
 */
export const getCurrentUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.authUser!.id;

    try {
        const user = await db
            .query.usersTable
            .findFirst({
                where: eq(usersTable.id, userId),
                with: {
                    profile: {
                        with: {
                            department: true,
                        }
                    },
                }
            })

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return sendSuccessResponse(res, user);
    } catch (e) {
        next(e);
    }
};

/**
 * Get all notes uploaded by the current user.
 * @param req Request
 * @param res Response
 * @returns Notes uploaded by the user or 500 on error
 */
export const getCurrentUserUploadedNotes = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.authUser!.id;

    try {
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
                    uploader: {
                        columns: {
                            id: true,
                            fullName: true,
                        }
                    },
                }
            });

        return sendSuccessResponse(res, notes);
    } catch (e) {
        next(e);
    }
};

/**
 * Get notes recently accessed by the current user.
 * @param req Request
 * @param res Response
 * @returns Recently accessed notes or 500 on error
 */
export const getCurrentUserRecentlyAccessedNotes = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.authUser!.id;

    try {
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
                            uploader: {
                                columns: {
                                    id: true,
                                    fullName: true,
                                }
                            },
                        }
                    }
                },
                orderBy: [desc(userRecentNotesTable.accessedAt)],
                limit: 5,
            });

        return sendSuccessResponse(res, notes);
    } catch (e) {
        next(e);
    }
};

/**
 * Get notes bookmarked/archived by a user.
 * @param req Request
 * @param res Response
 * @returns Archived notes or 500 on error
 */
export const getCurrentUserArchivedNotes = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.authUser!.id;

    try {
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
                            uploader: {
                                columns: {
                                    id: true,
                                    fullName: true,
                                }
                            },
                        }
                    }
                },
                orderBy: [desc(userArchivedNotesTable.archivedAt)],
                limit: 10,
            });

        return sendSuccessResponse(res, notes);
    } catch (e) {
        next(e);
    }
};

/**
 * Mark a note as recently accessed by the current user.
 * @param req Request
 * @param res Response
 * @returns Success message or 400 on invalid note ID or 404 if note not found or 500 on error
 */
export const markNoteAsRecentlyAccessed = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.authUser!.id;
    const noteId = Number(req.params.noteId);

    try {
        const note = await db.query.notesTable.findFirst({
            where: eq(notesTable.id, noteId),
        });

        if (!note) {
            throw new NotFoundError("Note not found");
        }

        await db.insert(userRecentNotesTable)
            .values({
                userId: Number(userId),
                noteId: noteId,
            })
            .onConflictDoUpdate({
                target: [userRecentNotesTable.userId, userRecentNotesTable.noteId],
                set: {
                    accessedAt: new Date(),
                },
            })

        return sendSuccessResponse(res, null, "Note marked as recently accessed");
    } catch (e) {
        next(e);
    }
};

/** * Mark a note as bookmarked/archived by the current user.
 * @param req Request
 * @param res Response
 * @returns Success message or 400 on invalid note ID or 404 if note not found or 500 on error
 */
export const markNoteAsArchived = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.authUser!.id;
    const noteId = Number(req.params.noteId);

    try {
        const note = await db.query.notesTable.findFirst({
            where: eq(notesTable.id, noteId),
        });

        if (!note) {
            throw new NotFoundError("Note not found");
        }

        await db.insert(userArchivedNotesTable)
            .values({
                userId: Number(userId),
                noteId: noteId,
            })
            .onConflictDoNothing();

        return sendSuccessResponse(res, null, "Note marked as archived");
    } catch (e) {
        next(e);
    }
};

/** * Unmark a note as bookmarked/archived by the current user.
 * @param req Request
 * @param res Response
 * @returns Success message or 400 on invalid note ID or 500 on error
 */
export const unmarkNoteAsArchived = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.authUser!.id;
    const noteId = Number(req.params.noteId);

    try {
        await db.delete(userArchivedNotesTable)
            .where(
                and(eq(userArchivedNotesTable.userId, Number(userId)), eq(userArchivedNotesTable.noteId, noteId)),
            );

        return sendSuccessResponse(res, null, "Note unmarked as archived");
    } catch (e) {
        next(e);
    }
};