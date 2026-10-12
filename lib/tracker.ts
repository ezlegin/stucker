"use server";

import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

// ---------- READ (limited list) ----------
export async function getTracks(limit = 10) {
  try {
    const tracks = await prisma.track.findMany({
      orderBy: [{ date: "desc" }, { from: "desc" }],
      take: limit,
    });
    return { success: true as const, data: tracks };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to fetch tracks" };
  }
}

// ---------- Weekly stats: last 7 days, per day ----------
export async function getWeeklyStats() {
  try {
    const days = 7;
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const tracks = await prisma.track.findMany({
      where: { date: { gte: start } },
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

// ---------- Monthly stats: last 5 weeks, per week ----------
export async function getMonthlyStats() {
  try {
    const weeks = 5;
    const now = new Date();
    const day = now.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // Monday start
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() + diff);
    thisWeekStart.setHours(0, 0, 0, 0);

    const rangeStart = new Date(thisWeekStart);
    rangeStart.setDate(thisWeekStart.getDate() - (weeks - 1) * 7);

    const tracks = await prisma.track.findMany({
      where: { date: { gte: rangeStart } },
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
  try {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const tracks = await prisma.track.findMany({
      where: { date: { gte: start } },
    });

    const map = tracks.reduce<Record<string, number>>((acc, t) => {
      acc[t.lesson] = (acc[t.lesson] ?? 0) + t.duration;
      return acc;
    }, {});

    const data = Object.entries(map).map(([lesson, mins]) => ({
      lesson,
      duration: Math.round((mins / 60) * 10) / 10,
    }));

    return { success: true as const, data };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed lessons stats" };
  }
}
