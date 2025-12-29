import type { Request, Response } from "express";
import nodemailer from "nodemailer";
import { prisma } from "../lib/prisma.js";

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
    const team = await prisma.team.create({ data: { name } });

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
                 width: 100%;
                   display: inline-block;
                   padding: 10px 20px;
                   margin-top: 20px;
                   background-color: #8098f0;
                   color: white;
                   text-decoration: none;
                   border-radius: 5px;
                   font-weight: bold;
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
