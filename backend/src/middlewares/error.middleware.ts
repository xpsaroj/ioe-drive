import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import env from "../config/env.js";
import { sendErrorResponse } from "../lib/response.js";
import { ApiError } from "../lib/errors.js";

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
    // Log everything except expected operational errors
    if (!(err instanceof ApiError) || !err.isOperational) {
        console.error(err);
    }

    // Zod validation errors
    if (err instanceof ZodError) {
        return sendErrorResponse(res, formatZodError(err), 400);
    }

    // Known / expected API errors
    if (err instanceof ApiError) {
        return sendErrorResponse(res, err.message, err.statusCode);
    }

    // Unknown errors
    return sendErrorResponse(
        res,
        env.NODE_ENV === "production"
            ? "Internal Server Error"
            : err instanceof Error
                ? err.message
                : "Unknown error",
        500
    );
}