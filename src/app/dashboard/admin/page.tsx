import { getSession } from "@/src/lib/session";
import { logout } from "@/src/app/actions/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/dashboard/user");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
          padding: "32px 0",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 28px 32px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>
            🛡️ Admin Panel
          </div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
            LearnPath AI
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "24px 16px" }}>
          {[
            { icon: "📊", label: "Dashboard", href: "/dashboard/admin", active: true },
            { icon: "👥", label: "Manajemen User", href: "/dashboard/admin/users" },
            { icon: "📚", label: "Manajemen Topik", href: "/dashboard/admin/topics" },
            { icon: "🎬", label: "Riwayat Tontonan", href: "/dashboard/admin/history" },
            { icon: "⚙️", label: "Pengaturan", href: "/dashboard/admin/settings" },
            { icon: "🏠", label: "Lihat Beranda", href: "/" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "12px",
                color: item.active ? "#fff" : "rgba(255,255,255,0.6)",
                background: item.active ? "rgba(99,102,241,0.4)" : "transparent",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: item.active ? 600 : 400,
                marginBottom: "4px",
                transition: "all 0.2s",
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Admin info + Logout */}
        <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div
              style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem", fontWeight: 700, color: "#fff",
                flexShrink: 0,
              }}
            >
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 600 }}>
                {session.name}
              </div>
              <div
                style={{
                  fontSize: "0.7rem", color: "#fbbf24", fontWeight: 700,
                  background: "rgba(251,191,36,0.15)", padding: "2px 8px",
                  borderRadius: "999px", display: "inline-block", marginTop: "2px",
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
                width: "100%", padding: "10px", borderRadius: "10px",
                background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5", fontSize: "0.875rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              🚪 Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "36px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1e1b4b", marginBottom: "6px" }}>
              Admin Dashboard 🛡️
            </h1>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
              Kelola platform LearnPath AI dari sini.
            </p>
          </div>
          <span
            style={{
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              color: "#fff",
              borderRadius: "999px",
              padding: "6px 20px",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            🛡️ ADMINISTRATOR
          </span>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {[
            { icon: "👥", label: "Total User", value: "—", color: "#6366f1", bg: "#eef2ff" },
            { icon: "📚", label: "Total Topik", value: "4", color: "#10b981", bg: "#ecfdf5" },
            { icon: "🎬", label: "Video Disimpan", value: "—", color: "#f59e0b", bg: "#fffbeb" },
            { icon: "🔍", label: "Pencarian Hari Ini", value: "—", color: "#6366f1", bg: "#eef2ff" },
          ].map((stat) => (
            <div
              key={stat.label}
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
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: stat.bg, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "1.4rem", marginBottom: "12px",
                }}
              >
                {stat.icon}
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder Sections */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {[
            { title: "👥 Daftar User", desc: "Manajemen user terdaftar" },
            { title: "📊 Aktivitas Platform", desc: "Log aktivitas pengguna" },
          ].map((section) => (
            <div
              key={section.title}
              style={{
                background: "#fff",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 4px 24px rgba(99,102,241,0.08)",
              }}
            >
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e1b4b", marginBottom: "8px" }}>
                {section.title}
              </h2>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginBottom: "32px" }}>
                {section.desc}
              </p>
              <div style={{ textAlign: "center", padding: "32px 0", color: "#d1d5db" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🚧</div>
                <p style={{ fontSize: "0.875rem" }}>Segera hadir</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
