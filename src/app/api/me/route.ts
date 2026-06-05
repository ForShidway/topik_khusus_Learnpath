import { getSession } from "@/src/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({
    userId: session.userId,
    name: session.name,
    role: session.role,
  });
}
