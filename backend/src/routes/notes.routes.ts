import express from "express"

/**
 * Notes-related routes.
 *
 * Routes:
 * - GET /check
 */
const router = express.Router()

// Mark a note as recently accessed
router.post("/check", (_req, res) => {
    res.json({ success: true });
});

export default router;