import { startOfWeek, endOfWeek, addDays } from "date-fns";
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

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    const taskForToday = await prisma.task.findMany({
      where: {
        userId: id!,
        startDate: {
          gte: today.toISOString(), // >= 00:00 do dia de hoje
          lt: tomorrow.toISOString(), // < 00:00 do próximo dia
        },
      },
    });

    // pega a semana atual (domingo como início)
    const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 }); // segunda-feira
    const endWeek = endOfWeek(new Date(), { weekStartsOn: 1 }); // domingo

    const tasksPerDay = [];

    for (let i = 0; i < 7; i++) {
      const dayStart = addDays(startWeek, i);
      dayStart.setUTCHours(0, 0, 0, 0); // início do dia UTC

      const dayEnd = addDays(dayStart, 1); // próximo dia
      dayEnd.setUTCHours(0, 0, 0, 0);

      const tasks = await prisma.task.count({
        where: {
          userId: id!,
          startDate: {
            gte: dayStart.toISOString(),
            lt: dayEnd.toISOString(),
          },
        },
      });

      function formatDay(date: Date) {
        const options: Intl.DateTimeFormatOptions = { weekday: "long" };
        return date.toLocaleDateString("en-US", options);
      }

      tasksPerDay.push({ day: formatDay(dayStart).charAt(0).toLocaleLowerCase() + formatDay(dayStart).slice(1), tasks });
    }

    return res.status(200).json({
      taskCount,
      teamMembersCount,
      taskForToday,
      tasksPerDay,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensage: "Internal server error" });
  }
}
