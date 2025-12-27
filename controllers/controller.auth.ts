import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password" });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      {
        userId: user.id,
        teamId: user.teamId || null,
        email: user.email,
      },
      process.env.SECRET!
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function register(req: Request, res: Response) {
  const { email, password, firstName, lastName, phone, teamId } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password,
        firstName,
        lastName,
        phone,
        teamId: teamId || null,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        teamId: user.teamId,
        email: user.email,
      },
      process.env.SECRET!
    );

    return res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
