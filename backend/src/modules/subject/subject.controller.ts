import type { Request, Response, NextFunction } from "express";

import type { Semester, Year } from "../../db/schema.js";
import { sendSuccessResponse } from "../../lib/response.js";
import { subjectService } from "./subject.service.js";

/**
 * Subject Controller
 * - Handles HTTP requests related to subjects.
 */
export class SubjectController {
    /**
     * Get subjects by program and semester.
     * - GET /api/subjects?programId=&semester=
     */
    async getSubjectsByProgramAndSemester(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const programId = Number(req.query.programId);
        const semester = req.query.semester as Semester | undefined;

        try {
            const subjects = await subjectService.getSubjectsByProgramAndSemester(programId, semester);
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

    /**
     * Get subjects list for showing in resource upload form based on program, year, and semester.
     * - GET /api/subjects/upload?programId=&year=&semester=
     */
    async getSubjectsForUpload(req: Request, res: Response, next: NextFunction) {
        const programId = Number(req.query.programId);
        const year = req.query.year as Year;
        const semester = req.query.semester as Semester;
        try {
            const subjects = await subjectService.getSubjectsForUpload(programId, year, semester);
            return sendSuccessResponse(res, subjects);
        } catch (e) {
            next(e);
        }
    }
}

export const subjectController = new SubjectController();