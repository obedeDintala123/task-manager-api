import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getUser(req: Request, res: Response) {
  try {
    const id = req.userId;

    if (!id) return res.status(401).json({ mensage: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        team: true,
        tasks: {
          orderBy: { createdAt: "desc" },
        },
      },
      omit: {
        password: true,
        teamId: true,
      },
    });

    if (!user) {
      return res.status(404).json({ mensage: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
