import "server-only";
import { cookies } from "next/headers";
import { encrypt, decrypt } from "./session-core";
import { SessionPayload } from "../types/session";

// ── Buat session & simpan ke cookie ──────────────────────────────────
export async function createSession(
  userId: string,
  role: "user" | "admin",
  name: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari
  const token = await encrypt({ userId, role, name, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

// ── Baca session yang sedang aktif ───────────────────────────────────
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  return decrypt(token);
}

// ── Hapus session (logout) ───────────────────────────────────────────
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
