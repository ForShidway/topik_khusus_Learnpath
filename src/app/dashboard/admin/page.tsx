"use client";

import { useEffect, useState } from "react";
import { logout } from "@/src/app/actions/auth";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

interface SessionInfo {
  userId: string;
  name: string;
  role: string;
}

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

interface StatsInfo {
  totalUsers: number;
  totalSearches: number;
}

export default function AdminDashboardPage() {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [stats, setStats] = useState<StatsInfo>({ totalUsers: 0, totalSearches: 0 });
  const [users, setUsers] = useState<UserItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"user" | "admin">("user");
  const [editPassword, setEditPassword] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
  const [deleteSaving, setDeleteSaving] = useState(false);

  // Initial Fetching
  useEffect(() => {
    Promise.all([
      fetch("/api/me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/admin/stats").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([me, statsData]) => {
        if (!me || me.role !== "admin") {
          window.location.href = "/login";
          return;
        }
        setSession(me);
        if (statsData?.success) {
          setStats({
            totalUsers: statsData.totalUsers,
            totalSearches: statsData.totalSearches,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Initialization failed", err);
        toast.error("Gagal memuat data awal");
        setLoading(false);
      });
  }, []);

  // Fetch Users based on pagination
  const fetchUsers = (page: number) => {
    setTableLoading(true);
    fetch(`/api/admin/users?page=${page}&limit=10`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users);
          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);
          // Sync total users count if it changed
          setStats((prev) => ({ ...prev, totalUsers: data.totalUsers }));
        } else {
          toast.error(data.error || "Gagal mengambil daftar user");
        }
        setTableLoading(false);
      })
      .catch(() => {
        toast.error("Terjadi kesalahan jaringan");
        setTableLoading(false);
      });
  };

  useEffect(() => {
    if (session) {
      fetchUsers(currentPage);
    }
  }, [session, currentPage]);

  const handleEditClick = (user: UserItem) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditPassword(""); // reset password input
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editName.trim() || !editEmail.trim()) {
      toast.error("Nama dan Email wajib diisi");
      return;
    }

    setEditSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingUser._id,
          name: editName.trim(),
          email: editEmail.trim(),
          role: editRole,
          password: editPassword ? editPassword : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("User berhasil diperbarui! 🎉");
        setEditModalOpen(false);
        fetchUsers(currentPage);
      } else {
        toast.error(data.error || "Gagal memperbarui user");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteClick = (user: UserItem) => {
    if (session && user._id === session.userId) {
      toast.error("Anda tidak bisa menghapus akun admin Anda sendiri!");
      return;
    }
    setDeletingUser(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setDeleteSaving(true);
    try {
      const res = await fetch(`/api/admin/users?id=${deletingUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("User berhasil dihapus! 🗑️");
        setDeleteModalOpen(false);
        // If last item of page was deleted, move back a page
        const newPage = users.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
        setCurrentPage(newPage);
        fetchUsers(newPage);
        // Update stats
        setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      } else {
        toast.error(data.error || "Gagal menghapus user");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setDeleteSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f4ff",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #6366f1",
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>Memuat dashboard admin…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f0f4ff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <Toaster position="top-right" />

      {/* ══ Sidebar ══════════════════════════════════ */}
      <aside
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)",
          padding: "32px 0",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "0 28px 32px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>
              🛡️ Admin Panel
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginTop: "4px" }}
            >
              LearnPath AI
            </div>
          </Link>
        </div>

        {/* Nav Tabs — Dashboard Only */}
        <nav style={{ flex: 1, padding: "24px 16px" }}>
          <button
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "12px",
              color: "#fff",
              background: "rgba(99,102,241,0.35)",
              border: "1px solid rgba(99,102,241,0.4)",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: "default",
              fontFamily: "inherit",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>📊</span>
            <span style={{ flex: 1 }}>Dashboard</span>
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#818cf8",
                flexShrink: 0,
              }}
            />
          </button>
        </nav>

        {/* User info + Logout */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {session?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div
                style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 600 }}
              >
                {session?.name}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#fbbf24",
                  fontWeight: 700,
                  background: "rgba(251,191,36,0.15)",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  display: "inline-block",
                  marginTop: "2px",
                }}
              >
                ADMIN
              </div>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                background: "rgba(239,68,68,0.18)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              🚪 Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* ══ Main Content ══════════════════════════════ */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#1e1b4b",
              marginBottom: "6px",
            }}
          >
            Dashboard Admin 🛡️
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
            Kelola platform LearnPath AI dari sini.
          </p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {/* Stat 1: Total User */}
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.08)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                marginBottom: "12px",
              }}
            >
              👥
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#6366f1" }}>
              {stats.totalUsers}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "4px" }}>
              Total User
            </div>
          </div>

          {/* Stat 2: Total Pencarian */}
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.08)",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "#ecfdf5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                marginBottom: "12px",
              }}
            >
              🔍
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#10b981" }}>
              {stats.totalSearches}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "4px" }}>
              Total Pencarian
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "28px 32px",
            boxShadow: "0 4px 24px rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e1b4b", marginBottom: "4px" }}>
                👥 Daftar User
              </h2>
              <p style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                Kelola hak akses dan akun pengguna platform
              </p>
            </div>
            <span style={{ fontSize: "0.8rem", color: "#6366f1", background: "#eef2ff", padding: "4px 12px", borderRadius: "999px", fontWeight: 600 }}>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* User Table */}
          <div style={{ overflowX: "auto", position: "relative", minHeight: "150px" }}>
            {tableLoading && (
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(255, 255, 255, 0.7)", display: "flex",
                alignItems: "center", justifyContent: "center", zIndex: 10,
                borderRadius: "12px"
              }}>
                <div style={{
                  width: "28px", height: "28px", border: "3px solid #e5e7eb",
                  borderTop: "3px solid #6366f1", borderRadius: "50%",
                  animation: "spin 0.9s linear infinite"
                }} />
              </div>
            )}

            {users.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>👥</div>
                <p style={{ fontSize: "0.9rem" }}>Belum ada user terdaftar</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <th style={{ padding: "14px 16px", color: "#6b7280", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase" }}>User</th>
                    <th style={{ padding: "14px 16px", color: "#6b7280", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase" }}>Email</th>
                    <th style={{ padding: "14px 16px", color: "#6b7280", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase" }}>Role</th>
                    <th style={{ padding: "14px 16px", color: "#6b7280", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase" }}>Terdaftar Pada</th>
                    <th style={{ padding: "14px 16px", color: "#6b7280", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} style={{ borderBottom: "1px solid #f9fafb", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fcfdff"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{
                            width: "36px", height: "36px", borderRadius: "50%",
                            background: user.role === "admin" ? "linear-gradient(135deg, #f59e0b, #ef4444)" : "linear-gradient(135deg, #6366f1, #818cf8)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: 700, fontSize: "0.95rem"
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#1f2937", fontSize: "0.875rem" }}>{user.name}</div>
                            {session && session.userId === user._id && (
                              <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 600 }}>Anda</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#4b5563", fontSize: "0.875rem" }}>
                        {user.email}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: "999px",
                          background: user.role === "admin" ? "rgba(245,158,11,0.12)" : "rgba(99,102,241,0.12)",
                          color: user.role === "admin" ? "#d97706" : "#4f46e5"
                        }}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#9ca3af", fontSize: "0.8rem" }}>
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          year: "numeric", month: "short", day: "numeric"
                        })}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px" }}>
                          <button
                            onClick={() => handleEditClick(user)}
                            style={{
                              background: "#fff", border: "1px solid #e5e7eb",
                              borderRadius: "8px", padding: "6px 12px",
                              fontSize: "0.78rem", fontWeight: 600, color: "#4f46e5",
                              cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#6366f1";
                              e.currentTarget.style.background = "#f5f6ff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#e5e7eb";
                              e.currentTarget.style.background = "#fff";
                            }}
                          >
                            ✏️ Edit
                          </button>
                          {(!session || session.userId !== user._id) && (
                            <button
                              onClick={() => handleDeleteClick(user)}
                              style={{
                                background: "#fff", border: "1px solid #fecaca",
                                borderRadius: "8px", padding: "6px 12px",
                                fontSize: "0.78rem", fontWeight: 600, color: "#dc2626",
                                cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#f87171";
                                e.currentTarget.style.background = "#fef2f2";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#fecaca";
                                e.currentTarget.style.background = "#fff";
                              }}
                            >
                              🗑️ Hapus
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", borderTop: "1px solid #f3f4f6", paddingTop: "20px" }}>
              <button
                disabled={currentPage === 1 || tableLoading}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                style={{
                  background: currentPage === 1 ? "#f3f4f6" : "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: currentPage === 1 ? "#9ca3af" : "#374151",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                ← Sebelumnya
              </button>
              <span style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>
                Halaman <strong style={{ color: "#1f2937" }}>{currentPage}</strong> dari <strong style={{ color: "#1f2937" }}>{totalPages}</strong>
              </span>
              <button
                disabled={currentPage === totalPages || tableLoading}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                style={{
                  background: currentPage === totalPages ? "#f3f4f6" : "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: currentPage === totalPages ? "#9ca3af" : "#374151",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                Selanjutnya →
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ══ MODAL: Edit User ══════════════════════════ */}
      {editModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(30, 27, 75, 0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999, padding: "20px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "480px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)", overflow: "hidden",
            animation: "modalFadeIn 0.3s ease"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #1e1b4b, #312e81)",
              padding: "20px 28px", color: "#fff", display: "flex",
              justifyContent: "space-between", alignItems: "center"
            }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>✏️ Edit Akun User</h3>
              <button onClick={() => setEditModalOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: "1.3rem", cursor: "pointer" }}>&times;</button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ padding: "28px" }}>
              {/* Name input */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#4b5563", marginBottom: "6px" }}>Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "10px",
                    border: "1px solid #e5e7eb", outline: "none", fontSize: "0.9rem",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              {/* Email input */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#4b5563", marginBottom: "6px" }}>Email</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "10px",
                    border: "1px solid #e5e7eb", outline: "none", fontSize: "0.9rem",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              {/* Role dropdown */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#4b5563", marginBottom: "6px" }}>Role Akun</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as "user" | "admin")}
                  //disabled={session && session.userId === editingUser?._id}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "10px",
                    border: "1px solid #e5e7eb", outline: "none", fontSize: "0.9rem",
                    fontFamily: "inherit", background: "#fff"
                  }}
                >
                  <option value="user">USER (Member)</option>
                  <option value="admin">ADMIN (Administrator)</option>
                </select>
                {session && session.userId === editingUser?._id && (
                  <span style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "4px", display: "block" }}>Anda tidak dapat mengubah role akun admin Anda sendiri.</span>
                )}
              </div>

              {/* Password (optional) */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#4b5563", marginBottom: "6px" }}>Password Baru <span style={{ fontWeight: 400, color: "#9ca3af" }}>(opsional)</span></label>
                <input
                  type="password"
                  placeholder="Kosongkan jika tidak ingin diubah"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: "10px",
                    border: "1px solid #e5e7eb", outline: "none", fontSize: "0.9rem",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  style={{
                    background: "#fff", border: "1px solid #e5e7eb",
                    borderRadius: "10px", padding: "10px 20px", fontSize: "0.88rem",
                    fontWeight: 600, color: "#374151", cursor: "pointer"
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  style={{
                    background: "linear-gradient(135deg, #1e1b4b, #312e81)",
                    border: "none", borderRadius: "10px", padding: "10px 24px",
                    fontSize: "0.88rem", fontWeight: 700, color: "#fff",
                    cursor: editSaving ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(49,46,129,0.2)"
                  }}
                >
                  {editSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ MODAL: Confirm Delete ════════════════════ */}
      {deleteModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(30, 27, 75, 0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999, padding: "20px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "420px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)", overflow: "hidden",
            animation: "modalFadeIn 0.3s ease"
          }}>
            <div style={{ padding: "28px 28px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>⚠️</div>
              <h3 style={{ margin: "0 0 8px", fontSize: "1.15rem", fontWeight: 800, color: "#1f2937" }}>Hapus Akun User?</h3>
              <p style={{ margin: 0, color: "#4b5563", fontSize: "0.875rem", lineHeight: 1.5 }}>
                Apakah Anda yakin ingin menghapus akun milik <strong>{deletingUser?.name}</strong> ({deletingUser?.email})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div style={{
              background: "#f9fafb", padding: "16px 28px", display: "flex",
              gap: "10px", justifyContent: "center"
            }}>
              <button
                type="button"
                disabled={deleteSaving}
                onClick={() => setDeleteModalOpen(false)}
                style={{
                  background: "#fff", border: "1px solid #e5e7eb",
                  borderRadius: "10px", padding: "10px 20px", fontSize: "0.88rem",
                  fontWeight: 600, color: "#374151", cursor: "pointer", flex: 1
                }}
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleteSaving}
                onClick={handleConfirmDelete}
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  border: "none", borderRadius: "10px", padding: "10px 20px",
                  fontSize: "0.88rem", fontWeight: 700, color: "#fff",
                  cursor: deleteSaving ? "not-allowed" : "pointer", flex: 1,
                  boxShadow: "0 4px 12px rgba(220,38,38,0.2)"
                }}
              >
                {deleteSaving ? "Menghapus..." : "Ya, Hapus Akun"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
