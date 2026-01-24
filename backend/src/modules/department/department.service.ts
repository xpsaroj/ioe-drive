import { db } from "../../db/index.js";

/**
 * Department Service
 * - Handles business logic related to departments.
 */
export class DepartmentService {

    /**
     * Get all departments.
     * @returns List of all the departments
     */
    async getAllDepartments() {
        return await db
            .query.departmentsTable
            .findMany();
    }
}

export const departmentService = new DepartmentService();