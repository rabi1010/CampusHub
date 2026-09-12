import { z } from "zod";

export const courseSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name is too long"),

  code: z
    .string()
    .min(1, "Course code is required")
    .regex(/^[A-Z]{2,4}[0-9]{3,4}$/, "Format must be like CS101 or BCA201"),

  departmentId: z.string().min(1, "Department is required"),

  credits: z
    .number({ error: "Credits must be a number" })
    .min(1, "Minimum 1 credit")
    .max(6, "Maximum 6 credits"),

  semester: z
    .number({ error: "Semester must be a number" })
    .min(1, "Minimum semester 1")
    .max(8, "Maximum semester 8"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description is too long"),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
