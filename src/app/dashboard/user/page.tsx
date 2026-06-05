import { getSession } from "@/src/lib/session";
import { logout } from "@/src/app/actions/auth";
import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4ff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)",
          padding: "32px 0",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 28px 32px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>
            📚 LearnPath
          </div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
            AI Learning Platform
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "24px 16px" }}>
          {[
            { icon: "🏠", label: "Beranda", href: "/" },
            { icon: "📖", label: "Dashboard", href: "/dashboard/user", active: true },
            { icon: "🎬", label: "Riwayat Tontonan", href: "/dashboard/user#history" },
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
                background: item.active ? "rgba(99,102,241,0.35)" : "transparent",
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

        {/* User info + Logout */}
        <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div
              style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
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
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>
                Member
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
        <div style={{ marginBottom: "36px" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1e1b4b", marginBottom: "6px" }}>
            Halo, {session.name}! 👋
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
            Lanjutkan perjalanan belajarmu hari ini.
          </p>
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
            { icon: "🎬", label: "Video Disimpan", value: "—", color: "#6366f1" },
            { icon: "📚", label: "Topik Dipelajari", value: "—", color: "#10b981" },
            { icon: "⭐", label: "Level Tercapai", value: "—", color: "#f59e0b" },
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
              <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Riwayat Section */}
        <div
          id="history"
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 4px 24px rgba(99,102,241,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1e1b4b" }}>
              🎬 Riwayat Tontonan
            </h2>
            <a
              href="/"
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "10px",
                padding: "8px 20px",
                fontSize: "0.82rem",
                fontWeight: 600,
              }}
            >
              + Cari Materi
            </a>
          </div>

          {/* Placeholder kosong */}
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#9ca3af",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎬</div>
            <p style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "4px" }}>
              Belum ada riwayat tontonan
            </p>
            <p style={{ fontSize: "0.875rem" }}>
              Simpan video dari halaman roadmap untuk melihatnya di sini.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
