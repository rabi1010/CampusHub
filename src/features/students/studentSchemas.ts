import { z } from "zod";

export const studentSchema = z.object({
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

  rollNo: z
    .string()
    .min(1, "Roll number is required")
    .regex(/^[A-Z0-9]+$/, "Roll number must be uppercase letters and numbers"),

  department: z.string().min(1, "Department is required"),

  batch: z.string().min(1, "Batch is required"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\-\s()]{7,15}$/, "Enter a valid phone number"),

  address: z
    .string()
    .min(1, "Address is required")
    .max(100, "Address is too long"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Edit schema — password optional when editing
export const studentEditSchema = studentSchema.omit({ password: true }).extend({
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 6,
      "Password must be at least 6 characters",
    ),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
export type StudentEditFormValues = z.infer<typeof studentEditSchema>;
