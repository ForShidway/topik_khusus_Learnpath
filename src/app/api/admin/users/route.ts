import { NextRequest } from "next/server";
import { getSession } from "@/src/lib/session";
import { connectDB } from "@/src/lib/mongodb";
import User from "@/src/models/User";
import bcrypt from "bcryptjs";
import { invalidateCache } from "@/src/lib/redis";
import { ADMIN_STATS_CACHE_KEY } from "@/src/app/api/admin/stats/route";

// GET /api/admin/users — Ambil daftar user terpaginasi
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const users = await User.find({}, { password: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments({});
    const totalPages = Math.ceil(total / limit);

    return Response.json({
      success: true,
      users,
      totalPages,
      currentPage: page,
      totalUsers: total,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/users:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT /api/admin/users — Update akun user
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, email, role, password } = body;

    if (!id || !name || !email || !role) {
      return Response.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Proteksi: jangan izinkan admin mengubah role-nya sendiri menjadi non-admin
    if (id === session.userId && role !== "admin") {
      return Response.json(
        { error: "Anda tidak dapat mengubah role admin Anda sendiri." },
        { status: 400 }
      );
    }

    await connectDB();

    // Cek email ganda
    const existing = await User.findOne({ email, _id: { $ne: id } });
    if (existing) {
      return Response.json(
        { error: "Email sudah terdaftar untuk pengguna lain." },
        { status: 400 }
      );
    }

    const updateData: any = { name, email, role };
    if (password && password.trim().length > 0) {
      if (password.trim().length < 6) {
        return Response.json(
          { error: "Password minimal harus 6 karakter." },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password.trim(), 12);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Invalidasi cache stats setelah data user berubah
    await invalidateCache(ADMIN_STATS_CACHE_KEY);

    return Response.json({ success: true, user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role } });
  } catch (error) {
    console.error("Error in PUT /api/admin/users:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/users — Hapus akun user
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "ID tidak ditemukan" }, { status: 400 });
    }

    // Proteksi: jangan izinkan admin menghapus dirinya sendiri
    if (id === session.userId) {
      return Response.json(
        { error: "Anda tidak dapat menghapus akun admin Anda sendiri." },
        { status: 400 }
      );
    }

    await connectDB();
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Invalidasi cache stats setelah user dihapus
    await invalidateCache(ADMIN_STATS_CACHE_KEY);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/users:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
