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

const router = Router();

router.get("/task", getTasks);
router.get("/task/:id", getTaskById);
router.get("/task", getTaskByStatus);
router.post("/task", createTask);
router.patch("/task/:id/status", updateStatusTask);
router.patch("/task/:id", updateTask);
router.delete("/task/:id", deleteTask);

export { router as taskRouter };
