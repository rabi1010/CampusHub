import { z } from "zod";

// ── Login schema ────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),

  role: z.enum(["admin", "teacher", "student"], {
    error: "Please select a role",
  }),
});

// ── Infer TypeScript type from schema (no duplication) ──
export type LoginFormValues = z.infer<typeof loginSchema>;
// Result: { email: string; password: string; role: 'admin'|'teacher'|'student' }

// ── Contact schema ──────────────────────────────────────
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  subject: z
    .string()
    .min(1, "Subject is required")
    .min(3, "Subject is too short")
    .max(100, "Subject is too long"),

  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
