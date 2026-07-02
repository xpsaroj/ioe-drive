import type { Request, Response, NextFunction } from 'express';

import { sendSuccessResponse } from '../../lib/response.js';
import { programService } from './program.service.js';

/**
 * Program Controller
 * - Handles HTTP requests related to programs.
 */
export class ProgramController {
    /**
     * Get all programs.
     * - GET /api/programs 
     */
    async getAllPrograms(
        _req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const programs = await programService.getAllPrograms();
            return sendSuccessResponse(res, programs);
        } catch (e) {
            next(e);
        }
    }
}

export const programController = new ProgramController();