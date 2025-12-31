import type { Request, Response } from "express";
import nodemailer from "nodemailer";
import { prisma } from "../lib/prisma.js";

export async function getAllTeams(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User id is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { teamId: true },
    });

    if (!user || !user.teamId) {
      return res.status(404).json({ message: "User or team not found" });
    }

    const team = await prisma.team.findMany({
      where: { id: user.teamId },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    return res.status(200).json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTeam(req: Request, res: Response) {
  try {
    const id = req.userId;

    if (!id) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id },
      select: { teamId: true },
    });

    if (!user?.teamId)
      return res.status(404).json({ message: "Team not found" });

    const team = await prisma.team.findUnique({
      where: { id: user.teamId },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTeam(req: Request, res: Response) {
  const { name, memberEmails } = req.body;

  if (!name) return res.status(400).json({ message: "Missing name" });
  if (memberEmails && !Array.isArray(memberEmails))
    return res.status(400).json({ message: "Emails must be an array" });

  try {
    // Verifica se o time já existe
    const existingTeam = await prisma.team.findUnique({ where: { name } });
    if (existingTeam)
      return res.status(400).json({ message: "Team already exists" });

    // Cria o time
    const team = await prisma.team.create({
      data: {
        name,
        users: {
          connect: memberEmails
            ? memberEmails.map((email: string) => ({ email }))
            : [
                {
                  id: req.userId,
                },
              ],
        },
      },
    });

    // Associa apenas o criador ao time (usuário existente)
    if (req.userId) {
      await prisma.user.update({
        where: { id: req.userId },
        data: { teamId: team.id },
      });
    }

    // Configura o transporter do Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });

    // Envia e-mails para todos os membros da lista
    if (memberEmails && memberEmails.length > 0) {
      for (const userEmail of memberEmails) {
        try {
          await transporter.sendMail({
            from: `Tasking <${process.env.ETHEREAL_USER}>`,
            to: userEmail,
            subject: "You have been added to a new team",
            html: `
              <h1>You have been added to a new team</h1>
              <p>You have been added to the team "<strong>${name}</strong>". Please log in to your account to view the team and start collaborating!</p>
              <a href="${process.env.FRONTEND_URL}"
                 style="
                 width: 90%;
                   display: inline-block;
                   padding: 10px 20px;
                   margin-top: 20px;
                   background-color: #8098f0;
                   color: white;
                   text-decoration: none;
                   border-radius: 5px;
                   font-weight: bold;
                    text-align: center;
                 ">
                 Login
              </a>
            `,
          });
        } catch (err) {
          console.error(`Failed to send email to ${userEmail}:`, err);
        }
      }
    }

    // Busca o time com usuários existentes
    const teamWithUsers = await prisma.team.findUnique({
      where: { id: team.id },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Retorna time + status de envio dos e-mails
    return res.status(201).json({
      message: "Team created successfully",
      team: teamWithUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createMember(req: Request, res: Response) {
  const { memberEmails } = req.body;
  const { id } = req.params;

  if (!memberEmails || !Array.isArray(memberEmails)) {
    return res.status(400).json({ message: "Missing memberEmails" });
  }

  try {
    // 1️⃣ Buscar o time
    const team = await prisma.team.findUnique({ where: { id } });
    if (!team) return res.status(404).json({ message: "Team not found" });

    // 2️⃣ Configurar transportador de email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });

    // 3️⃣ Buscar usuários existentes
    const users = await prisma.user.findMany({
      where: { email: { in: memberEmails } },
    });

    const foundEmails = users.map((u) => u.email);
    const notFoundEmails = memberEmails.filter(
      (email) => !foundEmails.includes(email)
    );

    // 4️⃣ Conectar apenas usuários existentes
    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        users: {
          connect: foundEmails.map((email) => ({ email })),
        },
      },
    });

    // 5️⃣ Enviar e-mails para todos (existentes + não existentes)
    const allEmails = [...memberEmails];
    for (const email of allEmails) {
      try {
        await transporter.sendMail({
          from: `Tasking <${process.env.ETHEREAL_USER}>`,
          to: email,
          subject: "You have been added to a new team",
          html: `
            <h1>You have been added to a new team</h1>
            <p>You have been added to the team "<strong>${team.name}</strong>". Please log in to your account to view the team and start collaborating!</p>
            <a href="${process.env.FRONTEND_URL}" style="
              width: 90%;
              display: inline-block;
              padding: 10px 20px;
              margin-top: 20px;
              background-color: #8098f0;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              text-align: center;
            ">Login</a>
          `,
        });
      } catch (err) {
        console.error(`Failed to send email to ${email}:`, err);
      }
    }

    // 6️⃣ Retornar resposta
    return res.status(200).json({
      message: "Members added successfully",
      team: updatedTeam,
      notFound: notFoundEmails, // Frontend pode informar "convite enviado"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateTeam(req: Request, res: Response) {
  const { name, memberEmails } = req.body;
  const { id } = req.params;

  if (!name) return res.status(400).json({ message: "Missing name" });
  if (memberEmails && !Array.isArray(memberEmails))
    return res.status(400).json({ message: "Emails must be an array" });

  try {
    const team = await prisma.team.update({
      where: { id },
      data: {
        name,
        users: {
          connect: memberEmails
            ? memberEmails.map((email: string) => ({ email }))
            : [
                {
                  id: req.userId,
                },
              ],
        },
      },
    });

    return res.status(200).json({ message: "Team updated successfully", team });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
