import { Router } from "express";
import * as healthController from "../controllers/health.controller.js";

/**
 * Health-related routes.
 *
 * Routes:
 * - GET /                      - Check the health of the server
 */
const router = Router();

router.get("/", healthController.healthCheck);

export default router;
