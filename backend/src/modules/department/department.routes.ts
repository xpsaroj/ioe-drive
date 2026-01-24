import { Router } from "express";

import { departmentController } from "./department.controller.js";

/**
 * Department Routes
 * 
 * Routes:
 * - GET /                   - Get all departments
 */
const router = Router();

/**
 * GET /api/departments
 * - Get all departments
 */
router.get(
    "/",
    departmentController.getAllDepartments.bind(departmentController)
);

export default router;