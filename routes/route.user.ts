import { getUser } from "../controllers/controller.user.js";
import { Router } from "express";

const router = Router();

router.get("/me", getUser);

export { router as userRouter };
