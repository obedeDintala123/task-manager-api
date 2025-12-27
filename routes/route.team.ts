import { createTeam } from "../controllers/controller.team.js";
import { Router } from "express";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.post("/team", authMiddleware, createTeam);

export { router as teamRouter };
