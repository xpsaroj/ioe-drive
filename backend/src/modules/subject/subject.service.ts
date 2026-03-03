import { asc } from "drizzle-orm"

import { db } from "../../db/index.js";
import type { Semester } from "../../db/schema.js";
import { NotFoundError } from "../../lib/errors.js";

/**
 * Subject Service
 * - Handles business logic related to subjects.
 */
export class SubjectService {
    /**
     * Get subjects by program and semester.
     * @param programId Program ID
     * @param semester Semester (optional)
     * @returns List of subjects
     */
    async getSubjectsByProgramAndSemester(programId: number, semester?: Semester) {
        return await db
            .query.subjectOfferingsTable
            .findMany({
                where: (fields, { eq, and }) => (
                    and(
                        eq(fields.programId, programId),
                        semester ? eq(fields.semester, semester) : undefined
                    )
                ),
                columns: {
                    id: true,
                    subjectId: true,
                    semester: true,
                    programId: true,
                    year: true,
                },
                with: {
                    subject: {
                        with: {
                            program: true,
                            marks: true,
                        }
                    },
                    program: true,
                },
                orderBy: (fields) => asc(fields.semester),
            })
    }

    /**
     * Get subject details by subject ID.
     * @param subjectId Subject ID
     * @returns Details of the subject
     */
    async getSubjectDetails(subjectId: number) {
        const subject = await db
            .query.subjectOfferingsTable
            .findFirst({
                where: (fields, { eq }) => eq(fields.id, subjectId),
                columns: {
                    id: true,
                    subjectId: true,
                    semester: true,
                    programId: true,
                    year: true,
                },
                with: {
                    subject: {
                        with: {
                            program: true,
                            marks: true,
                        }
                    },
                    program: true,
                }
            });

        if (!subject) {
            throw new NotFoundError("Subject not found");
        }

        return subject;
    }
}

export const subjectService = new SubjectService();