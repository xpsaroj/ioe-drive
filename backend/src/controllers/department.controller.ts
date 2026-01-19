import type { NextFunction, Request, Response } from "express";

import { db } from "../db/index.js";
import { sendSuccessResponse } from "../lib/response.js";

/**
 * Get all departments.
 * @param _req Request
 * @param res Response
 * @returns List of departments or 500 on error
 */
export const getAllDepartments = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const departments = await db
            .query.departmentsTable
            .findMany();

        return sendSuccessResponse(res, departments);
    } catch (e) {
        next(e);
    }
};