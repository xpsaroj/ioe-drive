import { db } from "../../db/index.js";

/**
 * Program Service
 * - Handles business logic related to programs.
 */
export class ProgramService {

    /**
     * Get all programs.
     * @returns List of all the programs
     */
    async getAllPrograms() {
        return await db
            .query.programsTable
            .findMany();
    }
}

export const programService = new ProgramService();