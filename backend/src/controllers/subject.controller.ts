import type { Request, Response, NextFunction } from "express";

import type { Semester } from "../db/schema.js";
import { db } from "../db/index.js";
import { sendSuccessResponse } from "../lib/response.js";
import { NotFoundError } from "../lib/errors.js";

/**
 * Get subjects by department and semester.
 * @param req Request
 * @param res Response
 * @returns List of subjects or 500 on error
 */
export const getSubjectsByDepartmentAndSemester = async (req: Request, res: Response, next: NextFunction) => {
    const departmentId = Number(req.query.departmentId);
    const semester = req.query.semester as Semester | undefined;

    try {
        const subjects = await db
            .query.subjectOfferingsTable
            .findMany({
                where: (fields, { eq, and }) => (
                    and(
                        eq(fields.departmentId, departmentId),
                        semester ? eq(fields.semester, semester) : undefined
                    )
                ),
                columns: {
                    id: true,
                    subjectId: true,
                    semester: true,
                    departmentId: true,
                    year: true,
                },
                with: {
                    subject: {
                        columns: {
                            id: true,
                            code: true,
                            name: true,
                            departmentId: true,
                        },
                        with: {
                            department: true
                        }
                    },
                }
            });

        return sendSuccessResponse(res, subjects);
    } catch (e) {
        next(e);
    }
};

/**
 * Get subject details by subject ID.
 * @param req Request
 * @param res Response
 * @returns Subject details or 500 on error
 */
export const getSubjectDetails = async (req: Request, res: Response, next: NextFunction) => {
    const subjectId = Number(req.params.subjectId);

    try {
        const subject = await db
            .query.subjectOfferingsTable
            .findFirst({
                where: (fields, { eq }) => eq(fields.id, subjectId),
                columns: {
                    id: true,
                    subjectId: true,
                    semester: true,
                    departmentId: true,
                    year: true,
                },
                with: {
                    subject: {
                        columns: {
                            id: true,
                            code: true,
                            name: true,
                            departmentId: true,
                        },
                        with: {
                            department: true
                        }
                    },
                }
            });

        if (!subject) {
            throw new NotFoundError("Subject not found");
        }

        return sendSuccessResponse(res, subject);
    } catch (e) {
        next(e);
    }
};