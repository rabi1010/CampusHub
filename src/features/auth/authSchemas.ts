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

  role: z.enum(["admin", "teacher", "student", "parent"], {
    error: "Please select a role",
  }),
});

// ── Infer TypeScript type from schema (no duplication) ──
export type LoginFormValues = z.infer<typeof loginSchema>;
// Result: { email: string; password: string; role: 'admin'|'teacher'|'student'|'parent' }

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
// ── Register schema ─────────────────────────────────────
export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  phone: z.string().optional(),

  role: z.enum(["STUDENT", "TEACHER", "PARENT"], {
    error: "Please select a role",
  }),

  // Only required when role = PARENT
  // Array of roll numbers for each child
  // Allow empty strings in the raw array (useful for default blank inputs)
  // and validate non-empty values when role === 'PARENT' in the refine step.
  childRollNumbers: z.array(z.string()).optional(),
})
.refine(
  (data) => {
    if (data.role === "PARENT") {
      // Must be a non-empty array and every roll number must be a non-empty string
      return (
        Array.isArray(data.childRollNumbers) &&
        data.childRollNumbers.length > 0 &&
        data.childRollNumbers.every(
          (r) => typeof r === "string" && r.trim().length > 0
        )
      )
    }
    return true
  },
  {
    message: "At least one child roll number is required for parents",
    path: ["childRollNumbers"],
  }
)

export type RegisterFormData = z.infer<typeof registerSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
