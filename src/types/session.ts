export interface SessionPayload {
  userId: string;
  role: "user" | "admin";
  name: string;
  expiresAt: Date;
}
