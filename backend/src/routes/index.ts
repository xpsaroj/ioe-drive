import { Router } from "express";

import meRoutes from "../modules/me/me.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import notesRoutes from "../modules/notes/notes.routes.js";
import departmentRoutes from "../modules/department/department.routes.js";
import subjectRoutes from "../modules/subject/subject.routes.js";

/**
 * Mount all application routes to the main router.
 */
const router = Router();

router.use("/me", meRoutes);
router.use("/users", userRoutes);
router.use("/notes", notesRoutes);
router.use("/departments", departmentRoutes);
router.use("/subjects", subjectRoutes);

export default router;