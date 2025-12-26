import { Router } from "express";
import { getDashboardMetrics } from "../controllers/controller.analysis.js";

const router = Router();

router.get("/dashboard", getDashboardMetrics);

export { router as analysisRouter };