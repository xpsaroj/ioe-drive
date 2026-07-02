import { Router } from "express";

import meRoutes from "../modules/me/me.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import notesRoutes from "../modules/notes/notes.routes.js";
import programRoutes from "../modules/program/program.routes.js";
import subjectRoutes from "../modules/subject/subject.routes.js";

/**
 * Mount all application routes to the main router.
 */
const router = Router();

router.use("/me", meRoutes);
router.use("/users", userRoutes);
router.use("/notes", notesRoutes);
router.use("/programs", programRoutes);
router.use("/subjects", subjectRoutes);

export default router;