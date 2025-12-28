import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getDashboardMetrics(req: Request, res: Response) {
  try {
    const id = req.userId;

    const taskCount = await prisma.task.count({
      where: {
        userId: id!,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: id! },
      select: { teamId: true },
    });

    let teamMembersCount = 0;

    if (user?.teamId) {
      teamMembersCount = await prisma.user.count({
        where: {
          teamId: user.teamId,
        },
      });
    }

    return res.status(200).json({
      taskCount,
      teamMembersCount,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensage: "Internal server error" });
  }
}
