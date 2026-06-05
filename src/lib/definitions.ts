import { z } from "zod";

// ── Schema Register ──────────────────────────────────────────────────
export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(50, "Nama maksimal 50 karakter")
      .trim(),
    email: z.string().email("Format email tidak valid").toLowerCase().trim(),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(100, "Password terlalu panjang"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

// ── Schema Login ─────────────────────────────────────────────────────
export const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid").toLowerCase().trim(),
  password: z.string().min(1, "Password wajib diisi"),
});

// ── FormState type untuk useActionState ──────────────────────────────
export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        general?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
