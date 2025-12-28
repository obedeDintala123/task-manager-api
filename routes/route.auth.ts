import { login, register } from "../controllers/controller.auth.js";
import { Router } from "express";

const router = Router();

router.post("/login", login);
router.post("/register", register);

export { router as authRouter };
