import type { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";

import env from "../config/env.js";
import { sendErrorResponse } from "../lib/response.js";
import { ApiError } from "../lib/errors.js";

// Helper function to format Zod validation errors
const formatZodError = (error: ZodError) => {
    const errors = error.issues.map((issue) => {
        const path = issue.path.join(".");
        return `${path}: ${issue.message}`;
    })

    return errors.join("; ");
}

// Helper function to format Multer errors
const formatMulterError = (error: MulterError) => {
    switch (error.code) {
        case "LIMIT_FILE_SIZE":
            return "File size exceeds the maximum limit.";
        case "LIMIT_FILE_COUNT":
            return "File count exceeds the maximum limit.";
        case "LIMIT_UNEXPECTED_FILE":
            return "Unexpected file field.";
        default:
            return error.message;
    }
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

    // Multer file upload errors
    if (err instanceof MulterError) {
        return sendErrorResponse(res, formatMulterError(err), 400);
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