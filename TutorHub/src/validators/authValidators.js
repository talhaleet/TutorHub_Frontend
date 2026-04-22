// authValidators.js — Zod validation schemas for all auth forms
// Zod validates form data on the CLIENT before any API call is made.
import { z } from "zod";
// z is the Zod namespace — provides all schema builders.
// ── Reusable password rule ──────────────────────────────────────────
// Same rules enforced on both frontend (Zod) and backend (Identity policy).
const passwordSchema = z
 .string()
 .min(8, "Password must be at least 8 characters")
 .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
 .regex(/[0-9]/, "Password must contain at least one number")
 .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
// These rules match the backend Identity password policy from Day 3 Program.cs.
// Consistent validation prevents confusing errors where client says valid but
// backend rejects.
// ── loginSchema ─────────────────────────────────────────────────────
// Used in LoginForm.jsx with react-hook-form resolver.
export const loginSchema = z.object({
 email: z.string().email("Please enter a valid email address"),
 password: z.string().min(1, "Password is required"),
 // Note: min(1) only — do not show full password rules on login,
 // as that leaks info about why authentication might be failing.
});
// ── registerSchema ───────────────────────────────────────────────────
// Used in RegisterForm.jsx.
export const registerSchema = z.object({
 firstName: z.string().min(2, "First name must be at least 2 characters").max(100),
 lastName: z.string().min(2, "Last name must be at least 2 characters").max(100),
 email: z.string().email("Please enter a valid email address"),
 password: passwordSchema,
 confirmPassword: z.string(),
 role: z.enum(["Student", "Parent", "Tutor"], {
 errorMap: () => ({ message: "Please select your account type" 
})
 }),
}).refine(
 (data) => data.password === data.confirmPassword,
 { message: "Passwords do not match", path: ["confirmPassword"] }
 // path tells react-hook-form which field to show the error under.
);
// ── forgotPasswordSchema ────────────────────────────────────────────
export const forgotPasswordSchema = z.object({
 email: z.string().email("Please enter a valid email address"),
});
// ── resetPasswordSchema ─────────────────────────────────────────────
export const resetPasswordSchema = z.object({
 newPassword: passwordSchema,
 confirmPassword: z.string(),
}).refine(
 (data) => data.newPassword === data.confirmPassword,
 { message: "Passwords do not match", path: ["confirmPassword"] }
);
// ── changePasswordSchema ─────────────────────────────────────────────
export const changePasswordSchema = z.object({
 currentPassword: z.string().min(1, "Current password is required"),
 newPassword: passwordSchema,
 confirmPassword: z.string(),
}).refine(
 (data) => data.newPassword === data.confirmPassword,
 { message: "Passwords do not match", path: ["confirmPassword"] }
);