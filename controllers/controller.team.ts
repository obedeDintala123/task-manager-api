import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function createTeam(req: Request, res: Response) {
  const { name } = req.body;

  if (!name) return res.status(400).json({ mensage: "Missing name" });

  try {
    const existingTeam = await prisma.team.findUnique({
      where: { name },
    });

    if (existingTeam)
      return res.status(400).json({ mensage: "Team already exists" });

    const team = await prisma.team.create({
      data: {
        name,
      },
    });

    return res.status(201).json({
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensage: "Internal server error" });
  }
}
