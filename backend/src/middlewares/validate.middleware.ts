import type { Request, Response, NextFunction } from "express";
import type { ZodObject } from "zod";

/**
 * A middleware to validate request data against a Zod schema. On error, it passes the error to the error handler middleware.
 * @param schema Zod schema to validate against
 * @returns Middleware function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validate = (schema: ZodObject<any>) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                params: req.params,
                query: req.query,
                body: req.body,
            });
            next();
        } catch (e) {
            next(e);
        }
    }
}