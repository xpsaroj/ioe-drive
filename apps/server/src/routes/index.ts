import { Router } from "express";

import meRoutes from "../modules/me/me.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import resourcesRoutes from "../modules/resources/resources.routes.js";
import programRoutes from "../modules/program/program.routes.js";
import subjectRoutes from "../modules/subject/subject.routes.js";

/**
 * Mount all application routes to the main router.
 */
const router = Router();

router.use("/me", meRoutes);
router.use("/users", userRoutes);
router.use("/resources", resourcesRoutes);
router.use("/programs", programRoutes);
router.use("/subjects", subjectRoutes);

export default router;