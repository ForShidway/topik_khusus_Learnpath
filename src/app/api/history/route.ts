import { NextRequest } from "next/server";
import { getSession } from "@/src/lib/session";
import { connectDB } from "@/src/lib/mongodb";
import WatchHistory from "@/src/models/WatchHistory";

// ── GET /api/history — Ambil riwayat user yang login ─────────────────
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const history = await WatchHistory.find({ userId: session.userId })
      .sort({ savedAt: -1 })
      .limit(50)
      .lean();

    return Response.json({ success: true, history });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// ── POST /api/history — Simpan video ke riwayat ───────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { topic, videoTitle, videoUrl, thumbnail } = body;

    if (!topic || !videoTitle || !videoUrl || !thumbnail) {
      return Response.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    await connectDB();

    // Cek apakah video ini sudah tersimpan (cegah duplikat)
    const existing = await WatchHistory.findOne({
      userId: session.userId,
      videoUrl,
    });

    if (existing) {
      return Response.json({ success: true, alreadySaved: true });
    }

    await WatchHistory.create({
      userId: session.userId,
      topic,
      videoTitle,
      videoUrl,
      thumbnail,
    });

    return Response.json({ success: true, alreadySaved: false });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// ── DELETE /api/history — Hapus satu item riwayat ────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "ID tidak ditemukan" }, { status: 400 });
    }

    await connectDB();
    await WatchHistory.deleteOne({ _id: id, userId: session.userId });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
