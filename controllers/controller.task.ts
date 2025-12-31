import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getTasks(req: Request, res: Response) {
  try {
    const id = req.userId;

    if (!id) return res.status(401).json({ mensage: "Unauthorized" });

    const tasks = await prisma.task.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensage: "Internal server error" });
  }
}

export async function getTaskById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const userId = req.userId;

    const task = await prisma.task.findFirst({
      where: {
        id: id!,
        userId: userId!,
      },
    });

    if (!task) return res.status(404).json({ mensage: "Task not found" });

    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensage: "Internal server error" });
  }
}

export async function getTaskByStatus(req: Request, res: Response) {
  const status = req.query.status as string | undefined;

  try {
    const tasks = await prisma.task.findMany({
      where: status ? { status } : {}, 
    });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "Tasks not found" });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTask(req: Request, res: Response) {
  try {
    const id = req.userId;

    if (!id) return res.status(401).json({ mensage: "Unauthorized" });

    const {
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      startHour,
      endHour,
    } = req.body as any;

    if (
      !title ||
      !status ||
      !priority ||
      !startDate ||
      !endDate ||
      !startHour ||
      !endHour
    )
      return res.status(400).json({ mensage: "Missing fields" });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        startDate,
        endDate,
        startHour,
        endHour,
        userId: id,
      },
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensage: "Internal server error" });
  }
}

export async function updateTask(req: Request, res: Response) {
  const { id } = req.params;
  const {
    title,
    description,
    status,
    priority,
    startDate,
    endDate,
    startHour,
    endHour,
  } = req.body as any;

  try {
    const userId = req.userId;

    if (!userId) return res.status(401).json({ mensage: "Unauthorized" });

    const task = await prisma.task.update({
      where: { id: id!, userId },
      data: {
        title,
        description,
        status,
        priority,
        startDate,
        endDate,
        startHour,
        endHour,
      },
    });

    if (!task) return res.status(404).json({ mensage: "Task not found" });

    return res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensage: "Internal server error" });
  }
}

export async function updateStatusTask(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await prisma.task.update({
      where: { id: id! },
      data: {
        status,
      },
    });

    if (!task) return res.status(404).json({ mensage: "Task not found" });

    return res.status(200).json({ status: task.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensage: "Internal server error" });
  }
}

export async function deleteTask(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const task = await prisma.task.delete({
      where: { id: id! },
    });

    if (!task) return res.status(404).json({ mensage: "Task not found" });

    return res.status(200).json({ mensage: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensage: "Internal server error" });
  }
}
