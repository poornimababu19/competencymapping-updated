import express from "express";
import { getMyNotifications, markNotificationAsRead } from "../controllers/jobController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", verifyToken, checkRole("student"), getMyNotifications);
router.post("/mark-read", verifyToken, checkRole("student"), markNotificationAsRead);

export default router;