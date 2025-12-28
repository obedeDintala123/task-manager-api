import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTaskByStatus,
  getTasks,
  updateStatusTask,
  updateTask,
} from "../controllers/controller.task.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/task", authMiddleware, getTasks);
router.get("/task/:id", authMiddleware, getTaskById);
router.get("/task", authMiddleware, getTaskByStatus);
router.post("/task", authMiddleware, createTask);
router.patch("/task/:id/status", authMiddleware, updateStatusTask);
router.patch("/task/:id", authMiddleware, updateTask);
router.delete("/task/:id", authMiddleware, deleteTask);

export { router as taskRouter };
