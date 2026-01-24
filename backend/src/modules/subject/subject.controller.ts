import type { Request, Response, NextFunction } from "express";

import type { Semester } from "../../db/schema.js";
import { sendSuccessResponse } from "../../lib/response.js";
import { subjectService } from "./subject.service.js";

/**
 * Subject Controller
 * - Handles HTTP requests related to subjects.
 */
export class SubjectController {
    /**
     * Get subjects by department and semester.
     * - GET /api/subjects?departmentId=&semester=
     */
    async getSubjectsByDepartmentAndSemester(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const departmentId = Number(req.query.departmentId);
        const semester = req.query.semester as Semester | undefined;

        try {
            const subjects = await subjectService.getSubjectsByDepartmentAndSemester(departmentId, semester);
            return sendSuccessResponse(res, subjects);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Get subject details by subject ID.
     * - GET /api/subjects/:subjectId
     */
    async getSubjectDetails(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const subjectId = Number(req.params.subjectId);

        try {
            const subjectDetails = await subjectService.getSubjectDetails(subjectId);
            return sendSuccessResponse(res, subjectDetails);
        } catch (e) {
            next(e);
        }
    }
}

export const subjectController = new SubjectController();