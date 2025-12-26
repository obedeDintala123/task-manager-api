import { createTeam } from "../controllers/controller.team.js";
import { Router } from "express";

const router = Router();

router.post("/team", createTeam);

export { router as teamRouter };
