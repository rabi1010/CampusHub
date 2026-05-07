import { z } from "zod";

export const teacherSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  employeeId: z
    .string()
    .min(1, "Employee ID is required")
    .regex(/^[A-Z0-9]+$/, "Must be uppercase letters and numbers"),

  department: z.string().min(1, "Department is required"),

  qualification: z.string().min(1, "Qualification is required"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\-\s()]{7,15}$/, "Enter a valid phone number"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const teacherEditSchema = teacherSchema.omit({ password: true }).extend({
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 6,
      "Password must be at least 6 characters",
    ),
});

export type TeacherFormValues = z.infer<typeof teacherSchema>;
export type TeacherEditFormValues = z.infer<typeof teacherEditSchema>;
