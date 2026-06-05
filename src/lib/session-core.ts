import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "@/src/types/session";

const secretKey = process.env.SESSION_SECRET || "fallback_secret_for_build_only_32_chars";
const encodedKey = new TextEncoder().encode(secretKey);

// ── Enkripsi payload menjadi JWT string ──────────────────────────────
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

// ── Dekripsi JWT string menjadi payload ──────────────────────────────
export async function decrypt(
  token: string | undefined = ""
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
