// lib/validationSchemas.ts
import { z } from "zod";

export const lessonEnum = z.enum(["math", "geometry", "physics", "chemistry"]);
export type LessonType = z.infer<typeof lessonEnum>;

export const trackerFormSchema = z
  .object({
    date: z.date(),
    from: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time"),
    to: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time"),
    lesson: lessonEnum,
  })
  .refine(
    (data) => {
      const [fh, fm] = data.from.split(":").map(Number);
      const [th, tm] = data.to.split(":").map(Number);
      return th * 60 + tm > fh * 60 + fm;
    },
    { message: "End time must be after start time", path: ["to"] },
  );

export type TrackerFormType = z.infer<typeof trackerFormSchema>;
