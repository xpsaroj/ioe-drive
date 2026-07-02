import { Router } from "express";

import { healthCheck } from "./health.controller.js";

/**
 * Health-related routes.
 *
 * Routes:
 * - GET /                      - Check the health of the server
 */
const router = Router();

/**
 * GET /health
 * - Check the health of the server
 */
router.get("/", healthCheck);

export default router;
