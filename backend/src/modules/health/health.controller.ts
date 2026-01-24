import type { Request, Response } from "express";

import { sendSuccessResponse } from "../../lib/response.js";

export class HealthController {
    /**
     * Check the health of the server.
     */
    public static healthCheck(
        _req: Request,
        res: Response
    ): void {
        const serverStatus = {
            status: "ok",
            timestamp: new Date().toISOString(),
        };

        sendSuccessResponse(res, serverStatus, "Server up and running.", 200);
    }
}

export const healthCheck = HealthController.healthCheck;