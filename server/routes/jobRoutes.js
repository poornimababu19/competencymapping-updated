import express from "express";
import {
  createJobProfile,
  getJobs,
  getCompanyJobs,
  updateJobProfile,
  deleteJobProfile,
  getCompanyStats,
  getJobByIdController,
} from "../controllers/jobController.js";
import { verifyToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getJobs); // public with pagination
router.get("/company", verifyToken, checkRole("company"), getCompanyJobs);
router.get("/company/stats", verifyToken, checkRole("company"), getCompanyStats);
router.get("/job/:id", verifyToken, checkRole("company"), getJobByIdController); // ✅ for edit

router.post("/", verifyToken, checkRole("company"), createJobProfile);
router.put("/:id", verifyToken, checkRole("company"), updateJobProfile);
router.delete("/:id", verifyToken, checkRole("company"), deleteJobProfile);

export default router;
