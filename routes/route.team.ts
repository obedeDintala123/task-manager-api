import { createMember, createTeam, getAllTeams, getTeam, updateTeam } from "../controllers/controller.team.js";
import { Router } from "express";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/team", authMiddleware, getTeam);
router.get("/teams/:id", authMiddleware, getAllTeams);
router.post("/team", authMiddleware, createTeam);
router.patch("/team/:id", authMiddleware, updateTeam);
router.patch("/team/:id/member", authMiddleware, createMember);

export { router as teamRouter };
