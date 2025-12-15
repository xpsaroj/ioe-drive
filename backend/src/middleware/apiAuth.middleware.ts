import type { Request, Response, NextFunction } from "express";

import { getAuth } from "@clerk/express";

export const apiAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token missing from Authorization header" });
        }

        const { isAuthenticated } = getAuth(req);

        if (!isAuthenticated) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        next();
    } catch (error) {
        console.error("API authentication error:", error);
        return res.status(500).json({ message: "Internal server error during authentication" });
    }
}