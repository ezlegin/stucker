"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
] as const;

const createLessonSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(40, "Keep it under 40 characters"),
});

export async function getLessons() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Not authenticated" };
  }

  try {
    const lessons = await prisma.lesson.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
    });
    return { success: true as const, data: lessons };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to fetch lessons" };
  }
}

export async function createLesson(input: { name: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Not authenticated" };
  }

  const parsed = createLessonSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid lesson name",
    };
  }

  try {
    const count = await prisma.lesson.count({
      where: { userId: session.user.id },
    });

    if (count >= 10) {
      return { error: "You can create a maximum of 10 lessons." };
    }

    const lesson = await prisma.lesson.create({
      data: {
        name: parsed.data.name,
        color: CHART_COLORS[count % CHART_COLORS.length],
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true as const, data: lesson };
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return {
        success: false as const,
        error: "You already have a lesson with that name",
      };
    }
    console.error(e);
    return { success: false as const, error: "Failed to create lesson" };
  }
}

export async function deleteLesson(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Not authenticated" };
  }

  try {
    const lesson = await prisma.lesson.findUnique({ where: { id } });
    if (!lesson || lesson.userId !== session.user.id) {
      return { success: false as const, error: "Not found" };
    }

    await prisma.$transaction([
      prisma.track.deleteMany({ where: { lessonId: id } }),
      prisma.lesson.delete({ where: { id } }),
    ]);

    revalidatePath("/dashboard");
    return { success: true as const };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to delete lesson" };
  }
}
