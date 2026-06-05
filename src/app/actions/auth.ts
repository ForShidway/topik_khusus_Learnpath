"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { connectDB } from "@/src/lib/mongodb";
import User from "@/src/models/User";
import { createSession, deleteSession } from "@/src/lib/session";
import {
  RegisterSchema,
  LoginSchema,
  FormState,
} from "@/src/lib/definitions";

// ── REGISTER ─────────────────────────────────────────────────────────
export async function register(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validasi input
  const validated = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, email, password } = validated.data;

  try {
    await connectDB();

    // 2. Cek email duplikat
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        errors: {
          email: ["Email sudah terdaftar. Silakan gunakan email lain."],
        },
      };
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Simpan user baru
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // 5. Buat session langsung
    await createSession(user._id.toString(), "user", name);
  } catch {
    return {
      errors: {
        general: ["Terjadi kesalahan server. Coba lagi."],
      },
    };
  }

  // 6. Redirect ke dashboard user (harus di luar try/catch)
  redirect("/dashboard/user");
}

// ── LOGIN ─────────────────────────────────────────────────────────────
export async function login(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validasi input
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;

  try {
    await connectDB();

    // 2. Cari user by email
    const user = await User.findOne({ email });
    if (!user) {
      return {
        errors: {
          general: ["Email atau password salah."],
        },
      };
    }

    // 3. Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return {
        errors: {
          general: ["Email atau password salah."],
        },
      };
    }

    // 4. Buat session
    await createSession(user._id.toString(), user.role, user.name);

    // 5. Redirect berdasarkan role
    if (user.role === "admin") {
      redirect("/dashboard/admin");
    } else {
      redirect("/dashboard/user");
    }
  } catch (error) {
    // Next.js redirect() melempar error NEXT_REDIRECT — kita re-throw
    if (
      error instanceof Error &&
      error.message.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    return {
      errors: {
        general: ["Terjadi kesalahan server. Coba lagi."],
      },
    };
  }

  // Fallback (tidak akan tercapai)
  return { success: false };
}

// ── LOGOUT ────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
