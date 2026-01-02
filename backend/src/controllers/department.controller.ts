import type { Request, Response } from "express";

import { db } from "../db/index.js";
import { sendSuccessResponse, sendErrorResponse } from "../lib/response.js";

/**
 * Get all departments.
 * @param _req Request
 * @param res Response
 * @returns List of departments or 500 on error
 */
export const getAllDepartments = async (_req: Request, res: Response) => {
    try {
        const departments = await db
            .query.departmentsTable
            .findMany();

        return sendSuccessResponse(res, departments);
    } catch (e) {
        console.error("Error fetching departments:", e);
        return sendErrorResponse(res, "Internal server error", 500);
    }
};