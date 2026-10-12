// app/actions/tracker.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TrackerFormType, trackerFormSchema } from "@/lib/vlidationSchemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ---------- Helpers ----------
function calcDuration(from: string, to: string): number {
  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);
  return th * 60 + tm - (fh * 60 + fm);
}

function normalizeTime(t: string): string {
  return t.length === 5 ? `${t}:00` : t;
}

// ---------- CREATE ----------
export async function createTrack(data: TrackerFormType) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Not authenticated" };
  }

  const parsed = trackerFormSchema.parse(data);

  const lesson = await prisma.lesson.findUnique({
    where: { id: parsed.lessonId },
  });
  if (!lesson || lesson.userId !== session.user.id) {
    return { success: false as const, error: "Invalid lesson" };
  }

  const track = await prisma.track.create({
    data: {
      date: parsed.date,
      from: normalizeTime(parsed.from),
      to: normalizeTime(parsed.to),
      duration: calcDuration(parsed.from, parsed.to),
      lessonId: parsed.lessonId,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  return { success: true as const, data: track };
}

// ---------- UPDATE ----------
export async function updateTrack(id: number, data: TrackerFormType) {
  try {
    const parsed = trackerFormSchema.parse(data);

    const track = await prisma.track.update({
      where: { id },
      data: {
        date: parsed.date,
        from: normalizeTime(parsed.from),
        to: normalizeTime(parsed.to),
        duration: calcDuration(parsed.from, parsed.to),
        lessonId: parsed.lessonId,
      },
    });

    revalidatePath("/dashboard");

    return { success: true as const, data: track };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        error: "Validation failed",
        issues: error.issues,
      };
    }
    console.error("updateTrack error:", error);
    return { success: false as const, error: "Failed to update track" };
  }
}

// ---------- DELETE ----------
export async function deleteTrack(id: number) {
  try {
    await prisma.track.delete({ where: { id } });
    revalidatePath("/dashboard");

    return { success: true as const };
  } catch (error) {
    console.error("deleteTrack error:", error);
    return { success: false as const, error: "Failed to delete track" };
  }
}

// ---------- READ (list) ----------
export async function getTracks() {
  try {
    const tracks = await prisma.track.findMany({
      orderBy: [{ date: "desc" }, { from: "desc" }],
    });
    return { success: true as const, data: tracks };
  } catch (error) {
    console.error("getTracks error:", error);
    return { success: false as const, error: "Failed to fetch tracks" };
  }
}

// ---------- READ (single) ----------
export async function getTrack(id: number) {
  try {
    const track = await prisma.track.findUnique({ where: { id } });
    if (!track) return { success: false as const, error: "Not found" };
    return { success: true as const, data: track };
  } catch (error) {
    console.error("getTrack error:", error);
    return { success: false as const, error: "Failed to fetch track" };
  }
}
