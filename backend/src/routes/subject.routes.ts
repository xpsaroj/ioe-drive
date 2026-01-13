import express from "express"

import { validate } from "../middlewares/validate.middleware.js";
import * as subjectController from "../controllers/subject.controller.js";
import { getSubjectsSchema, getSubjectDetailsSchema } from "../schemas/subjects.schema.js";

/**
 * Subject Routes
 * 
 * Routes:
 * - GET /                   - Get subjects by department and semester
 * - GET /:subjectId         - Get subject details by ID
 */
const router = express.Router()

router.get(
    "/",
    validate(getSubjectsSchema),
    subjectController.getSubjectsByDepartmentAndSemester
);

router.get(
    "/:subjectId",
    validate(getSubjectDetailsSchema),
    subjectController.getSubjectDetails
);

export default router;
