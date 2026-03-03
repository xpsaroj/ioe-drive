import { Router } from "express";

import { programController } from "./program.controller.js";

/**
 * Program Routes
 * 
 * Routes:
 * - GET /                   - Get all programs
 */
const router = Router();

/**
 * GET /api/programs
 * - Get all programs
 */
router.get(
    "/",
    programController.getAllPrograms.bind(programController)
);

export default router;