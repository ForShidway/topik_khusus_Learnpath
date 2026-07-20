import { getSession } from "@/src/lib/session";
import { connectDB } from "@/src/lib/mongodb";
import User from "@/src/models/User";
import SearchLog from "@/src/models/SearchLog";
import { getCached } from "@/src/lib/redis";

export const ADMIN_STATS_CACHE_KEY = "admin:stats";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Cache stats selama 60 detik di Redis
    const stats = await getCached(
      ADMIN_STATS_CACHE_KEY,
      60,
      async () => {
        const totalUsers = await User.countDocuments({});
        const totalSearches = await SearchLog.countDocuments({});
        return { totalUsers, totalSearches };
      }
    );

    return Response.json({
      success: true,
      totalUsers: stats.totalUsers,
      totalSearches: stats.totalSearches,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/stats:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
