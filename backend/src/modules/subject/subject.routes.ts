import { Router } from "express";

import { subjectController } from "./subject.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { getSubjectsSchema, getSubjectDetailsSchema, getSubjectsForUploadSchema } from "./subject.dto.js";

/**
 * Subject Routes
 * 
 * Routes:
 * - GET /                   - Get subjects by program and semester
 * - GET /:subjectId         - Get subject details by ID
 * - GET /for-upload         - Get subjects list for showing in resource upload form based on program, year, and semester
 */
const router = Router();

/**
 * GET /api/subjects
 * - Get subjects by program and semester
 */
router.get(
    "/",
    validate(getSubjectsSchema),
    subjectController.getSubjectsByProgramAndSemester.bind(subjectController)
);

/**
 * GET /api/subjects/for-upload
 * - Get subjects list for showing in resource upload form based on program, year, and semester
 */
router.get(
    "/upload",
    validate(getSubjectsForUploadSchema),
    subjectController.getSubjectsForUpload.bind(subjectController)
);

/**
 * GET /api/subjects/:subjectId
 * - Get subject details by ID
 */
router.get(
    "/:subjectId",
    validate(getSubjectDetailsSchema),
    subjectController.getSubjectDetails.bind(subjectController)
);

export default router;