import type { Request, Response } from "express";

import { sendSuccessResponse } from "../lib/response.js";

export const healthCheck = (_req: Request, res: Response) => {
    const serverStatus = {
        status: "ok",
        timestamp: new Date().toISOString(),
    }

    sendSuccessResponse(res, serverStatus, "Server up and running.", 200);
};
