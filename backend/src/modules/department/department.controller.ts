import type { Request, Response, NextFunction } from 'express';

import { sendSuccessResponse } from '../../lib/response.js';
import { departmentService } from './department.service.js';

/**
 * Department Controller
 * - Handles HTTP requests related to departments.
 */
export class DepartmentController {
    /**
     * Get all departments.
     * - GET /api/departments 
     */
    async getAllDepartments(
        _req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const departments = await departmentService.getAllDepartments();
            return sendSuccessResponse(res, departments);
        } catch (e) {
            next(e);
        }
    }
}

export const departmentController = new DepartmentController();