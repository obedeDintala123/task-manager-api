import { login, register } from "../controllers/controller.auth.js";
import { Router } from "express";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.post("/login", login, authMiddleware);
router.post("/register", register);

export { router as authRouter };
