import { getUser } from "../controllers/controller.user.js";
import { Router } from "express";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/me", authMiddleware, getUser);

export { router as userRouter };
