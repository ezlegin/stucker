import z from "zod";

export const trackerFormSchema = z
  .object({
    date: z.date(),
    from: z.string(),
    to: z.string(),
    lessonId: z.number().int().positive(),
  })
  .refine((data) => data.to > data.from, {
    message: "End date and time must be after start date and time.",
    path: ["to"],
  });

export type TrackerFormType = z.infer<typeof trackerFormSchema>;
