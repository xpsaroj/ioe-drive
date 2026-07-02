import type { Response } from "express";

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

/**
 * Sends a standardized success response.
 * @param res Response
 * @param data The data to send in the response
 * @param message Optional message
 * @param statusCode HTTP status code (default: 200)
 * @returns Response
 */
export const sendSuccessResponse = <T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
): Response => {
    const response: ApiResponse<T> = {
        success: true,
        data,
    }

    if (message) {
        response.message = message;
    }

    return res.status(statusCode).json(response);
}

/**
 * Sends a standardized error response.
 * @param res Response
 * @param error Error message 
 * @param statusCode HTTP status code (default: 500)
 * @returns Response
 */
export const sendErrorResponse = (
    res: Response,
    error: string,
    statusCode: number = 500
): Response => {
    const response: ApiResponse = {
        success: false,
        error,
    }

    return res.status(statusCode).json(response);
}