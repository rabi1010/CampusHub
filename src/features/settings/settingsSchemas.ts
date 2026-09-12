import { z } from "zod";

// ── Profile schema ───────────────────────────────────────
export const profileSchema = z.object({
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

  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[0-9+\-\s()]{7,15}$/, "Enter a valid phone number"),
});

// ── Password schema ──────────────────────────────────────
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),

    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current",
    path: ["newPassword"],
  });

// ── College info schema ──────────────────────────────────
export const collegeSchema = z.object({
  name: z
    .string()
    .min(1, "College name is required")
    .max(100, "Name is too long"),

  email: z.string().min(1, "Email is required").email("Enter a valid email"),

  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[0-9+\-\s()]{7,15}$/, "Enter a valid phone number"),

  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address is too long"),

  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith("http"),
      "Website must start with http or https",
    ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
export type CollegeFormValues = z.infer<typeof collegeSchema>;
