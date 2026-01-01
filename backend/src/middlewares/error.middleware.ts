import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import env from "../config/env.js";
import { sendErrorResponse } from "../lib/response.js";

const formatZodError = (error: ZodError) => {
    const errors = error.issues.map((issue) => {
        const path = issue.path.join(".");
        return `${path}: ${issue.message}`;
    })

    return errors.join("; ");
}

/**
 * Global error handling middleware. Logs the error and sends a standardized error response.
 * @param err Error object
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);

    if (err instanceof ZodError) {
        sendErrorResponse(res, formatZodError(err), 400);
        return;
    }

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    sendErrorResponse(
        res,
        env.NODE_ENV === "production"
            ? "Internal Server Error"
            : err.message,
        statusCode
    );
}