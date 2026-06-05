import { getSession } from "@/src/lib/session";
import { connectDB } from "@/src/lib/mongodb";
import User from "@/src/models/User";
import SearchLog from "@/src/models/SearchLog";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const totalUsers = await User.countDocuments({});
    const totalSearches = await SearchLog.countDocuments({});

    return Response.json({
      success: true,
      totalUsers,
      totalSearches,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/stats:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
