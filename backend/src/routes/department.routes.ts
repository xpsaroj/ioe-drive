import express from "express"

import * as departmentController from "../controllers/department.controller.js";

/**
 * Department Routes
 * 
 * Routes:
 * - GET /                   - Get all departments
 */
const router = express.Router()

router.get(
    "/",
    departmentController.getAllDepartments
);

export default router;
