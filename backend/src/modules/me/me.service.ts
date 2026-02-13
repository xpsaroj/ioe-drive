import { eq, desc, and } from "drizzle-orm";

import { db } from "../../db/index.js";
import { notesTable, userRecentNotesTable, userArchivedNotesTable } from "../../db/schema.js";
import { profilesTable } from "../../db/schema.js";
import { NotFoundError } from "../../lib/errors.js";
import type { UpdateProfileInput } from "./me.dto.js";

/**
 * Me Service
 * - Handles business logic related to the currently authenticated user.
 */
export class MeService {
    /**
     * Retrieves the profile of the currently authenticated user.
     * @param userId Currently authenticated user's id (through auth middleware)
     * @returns User profile
     */
    async getProfile(userId: number) {
        const userProfile = await db
            .query.usersTable
            .findFirst({
                where: (fields, { eq }) => eq(fields.id, userId),
                with: {
                    profile: {
                        with: {
                            department: true,
                        }
                    },
                }
            });

        if (!userProfile) {
            throw new NotFoundError("User not found");
        }

        return userProfile;
    }

    /**
     * Retrieves all notes uploaded by the currently authenticated user.
     * @param userId Currently authenticated user's id
     * @returns Notes uploaded by the user
     */
    async getUploadedNotes(userId: number) {
        return await db
            .query.notesTable
            .findMany({
                where: eq(notesTable.uploadedBy, userId),
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
    }

    /**
     * Retrieves the recently accessed notes of the currently authenticated user.
     * @param userId Currently authenticated user's id
     * @returns Recently accessed notes by the user
     */
    async getRecentlyAccessedNotes(userId: number) {
        return await db
            .query.userRecentNotesTable
            .findMany({
                where: eq(userRecentNotesTable.userId, userId),
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
    }

    /**
     * Retrieves the archived/bookmarked notes of the currently authenticated user.
     * @param userId Currently authenticated user's id
     * @returns Archived notes by the user
     */
    async getArchivedNotes(userId: number) {
        return await db
            .query.userArchivedNotesTable
            .findMany({
                where: eq(userArchivedNotesTable.userId, userId),
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
    }

    /**
     * Marks a note as recently accessed by the user.
     * @param userId User ID
     * @param noteId Note ID
     */
    async markNoteAsRecentlyAccessed(userId: number, noteId: number) {
        const existingNote = await db
            .query.notesTable
            .findFirst({
                where: eq(notesTable.id, noteId),
            });

        if (!existingNote) {
            throw new NotFoundError("Note not found");
        }

        const now = new Date();

        await db
            .insert(userRecentNotesTable)
            .values({
                userId,
                noteId,
                accessedAt: now,
            })
            .onConflictDoUpdate({
                target: [userRecentNotesTable.userId, userRecentNotesTable.noteId],
                set: {
                    accessedAt: now,
                },
            });
    }

    /**
     * Marks a note as archived/bookmarked by the user.
     * @param userId User ID
     * @param noteId Note ID
     */
    async markNoteAsArchived(userId: number, noteId: number) {
        const existingNote = await db
            .query.notesTable
            .findFirst({
                where: eq(notesTable.id, noteId),
            });

        if (!existingNote) {
            throw new NotFoundError("Note not found");
        }

        const now = new Date();

        await db
            .insert(userArchivedNotesTable)
            .values({
                userId,
                noteId,
                archivedAt: now,
            })
            .onConflictDoNothing();
    }

    /**
     * Unmarks a note as archived/bookmarked by the user.
     * @param userId User ID
     * @param noteId Note ID
     */
    async unmarkNoteAsArchived(userId: number, noteId: number) {
        await db
            .delete(userArchivedNotesTable)
            .where(
                and(
                    eq(userArchivedNotesTable.userId, userId),
                    eq(userArchivedNotesTable.noteId, noteId)
                )
            );
    }

    /**
     * Updates the currently authenticated user's profile.
     * @param userId User ID
     * @param noteId Note ID
     */
    async updateProfile(userId: number, data: Partial<UpdateProfileInput>) {
        await db.transaction(async (tx) => {
            const existingProfile = await tx.query.profilesTable.findFirst({
                where: eq(profilesTable.userId, userId),
            });

            if (!existingProfile) throw new NotFoundError("User profile not found");

            // Prepare profile data
            const profileData: Partial<UpdateProfileInput> = {};
            if (data.bio !== undefined) profileData.bio = data.bio;
            if (data.departmentId !== undefined) profileData.departmentId = data.departmentId;
            if (data.semester !== undefined) profileData.semester = data.semester;
            if (data.college !== undefined) profileData.college = data.college;

            // Update profile
            if (Object.keys(profileData).length > 0) {
                const [updatedProfile] = await tx.update(profilesTable)
                    .set(profileData)
                    .where(eq(profilesTable.userId, userId))
                    .returning();

                return updatedProfile;
            }

            return existingProfile;
        });
    }
}

export const meService = new MeService();