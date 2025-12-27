import { Router } from "express";
import { getDashboardMetrics } from "../controllers/controller.analysis.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", authMiddleware, getDashboardMetrics);

export { router as analysisRouter };