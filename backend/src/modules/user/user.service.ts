import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";

import { usersTable } from "../../db/schema.js";
import { NotFoundError } from "../../lib/errors.js";

/**
 * User Service
 * - Handles business logic related to users.
 */
export class UserService {
    /**
     * Retrieves a user's profile by their ID.
     * @param userId ID of the user to retrieve
     * @returns User profile
     */
    async getUserProfileById(userId: number) {
        const userProfile = await db
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

        if (!userProfile) {
            throw new NotFoundError("User not found");
        }

        return userProfile;
    }
}

export const userService = new UserService();