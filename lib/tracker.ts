"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { cache } from "react";

export const getSessionUser = cache(async () => {
  return (await auth())?.user ?? null;
});
// ---------- READ (limited list) ----------
export async function getTracks(limit = 10) {
  const user = await getSessionUser();
  if (!user) return { success: false as const, error: "Not authenticated" };

  try {
    const tracks = await prisma.track.findMany({
      where: { userId: user.id },
      orderBy: [{ date: "desc" }, { from: "desc" }],
      take: limit,
      include: {
        lesson: { select: { id: true, name: true, color: true } },
      },
    });
    return { success: true as const, data: tracks };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to fetch tracks" };
  }
}

// ---------- Weekly stats ----------
export async function getWeeklyStats() {
  const user = await getSessionUser();
  if (!user) return { success: false as const, error: "Not authenticated" };

  try {
    const days = 7;
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const tracks = await prisma.track.findMany({
      where: { date: { gte: start }, userId: user.id },
    });

    const data = Array.from({ length: days }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dayStart = new Date(d);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const total = tracks
        .filter((t) => t.date >= dayStart && t.date <= dayEnd)
        .reduce((s, t) => s + t.duration, 0);

      return {
        label: format(d, "EEE"),
        date: format(d, "yyyy-MM-dd"),
        duration: Math.round((total / 60) * 10) / 10,
      };
    });

    return { success: true as const, data };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed weekly stats" };
  }
}

// ---------- Monthly stats ----------
export async function getMonthlyStats() {
  const user = await getSessionUser();
  if (!user) return { success: false as const, error: "Not authenticated" };

  try {
    const weeks = 5;
    const now = new Date();
    const day = now.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() + diff);
    thisWeekStart.setHours(0, 0, 0, 0);

    const rangeStart = new Date(thisWeekStart);
    rangeStart.setDate(thisWeekStart.getDate() - (weeks - 1) * 7);

    const tracks = await prisma.track.findMany({
      where: { date: { gte: rangeStart }, userId: user.id },
    });

    const data = Array.from({ length: weeks }).map((_, i) => {
      const wStart = new Date(rangeStart);
      wStart.setDate(rangeStart.getDate() + i * 7);
      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 6);
      wEnd.setHours(23, 59, 59, 999);

      const total = tracks
        .filter((t) => t.date >= wStart && t.date <= wEnd)
        .reduce((s, t) => s + t.duration, 0);

      return {
        label: format(wStart, "MMM d"),
        date: format(wStart, "yyyy-MM-dd"),
        duration: Math.round((total / 60) * 10) / 10,
      };
    });

    return { success: true as const, data };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed monthly stats" };
  }
}

// ---------- Lessons studied this week ----------
export async function getLessonsThisWeek() {
  const user = await getSessionUser();
  if (!user) return { success: false as const, error: "Not authenticated" };

  try {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const tracks = await prisma.track.findMany({
      where: { date: { gte: start }, userId: user.id },
      include: {
        lesson: { select: { id: true, name: true, color: true } },
      },
    });

    const map = new Map<
      string,
      { name: string; color: string; duration: number }
    >();

    for (const t of tracks) {
      const existing = map.get(t.lessonId);
      if (existing) {
        existing.duration += t.duration;
      } else {
        map.set(t.lessonId, {
          name: t.lesson.name,
          color: t.lesson.color,
          duration: t.duration,
        });
      }
    }

    const data = Array.from(map.entries()).map(([lessonId, v]) => ({
      lessonId,
      name: v.name,
      color: v.color,
      duration: Math.round((v.duration / 60) * 10) / 10,
    }));

    return { success: true as const, data };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed lessons stats" };
  }
}
