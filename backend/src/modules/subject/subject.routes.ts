import { Router } from "express";

import { subjectController } from "./subject.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { getSubjectsSchema, getSubjectDetailsSchema } from "./subject.dto.js";

/**
 * Subject Routes
 * 
 * Routes:
 * - GET /                   - Get subjects by department and semester
 * - GET /:subjectId         - Get subject details by ID
 */
const router = Router();

/**
 * GET /api/subjects
 * - Get subjects by department and semester
 */
router.get(
    "/",
    validate(getSubjectsSchema),
    subjectController.getSubjectsByDepartmentAndSemester.bind(subjectController)
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