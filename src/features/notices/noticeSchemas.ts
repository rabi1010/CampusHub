import { z } from "zod";

export const noticeSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),

  content: z
    .string()
    .min(1, "Content is required")
    .min(10, "Content must be at least 10 characters")
    .max(1000, "Content is too long"),

  forRole: z.enum(["ALL", "TEACHER", "STUDENT"], {
    error: "Please select an audience",
  }),

  urgent: z.boolean().default(false),
});

export type NoticeFormValues = z.infer<typeof noticeSchema>;
