"use client";

import { useEffect, useState } from "react";
import { logout } from "@/src/app/actions/auth";
import Link from "next/link";
import VideoCard from "@/src/components/VideoCard";

type Tab = "dashboard" | "watched" | "saved";

interface SessionInfo {
  name: string;
  role: string;
  userId: string;
}

interface HistoryItem {
  _id: string;
  topic: string;
  videoTitle: string;
  videoUrl: string;
  thumbnail: string;
  savedAt: string;
  lastViewedAt?: string | null;
  isSaved?: boolean;
}

function getVideoId(url: string) {
  return url.split("v=")[1]?.split("&")[0] || "";
}

export default function UserDashboardPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/history").then((r) => (r.ok ? r.json() : null)),
    ]).then(([me, hist]) => {
      if (!me) {
        window.location.href = "/login";
        return;
      }
      setSession(me);
      if (hist?.success) setHistory(hist.history);
      setLoading(false);
    });
  }, []);

  const switchTab = (next: Tab) => {
    if (next === tab) return;
    setFading(true);
    setTimeout(() => {
      setTab(next);
      setFading(false);
    }, 180);
  };

  const savedVideos = history.filter((h) => h.isSaved !== false);
  const watchedVideos = history
    .filter((h) => !!h.lastViewedAt)
    .sort((a, b) => {
      const timeA = a.lastViewedAt ? new Date(a.lastViewedAt).getTime() : 0;
      const timeB = b.lastViewedAt ? new Date(b.lastViewedAt).getTime() : 0;
      return timeB - timeA;
    });

  const uniqueTopics = new Set(savedVideos.map((h) => h.topic)).size;

  /* ─── Loading ─────────────────────────────────── */
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
          <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>Memuat dashboard…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const navItems: { icon: string; label: string; key: Tab }[] = [
    { icon: "📊", label: "Dashboard", key: "dashboard" },
    { icon: "🎬", label: "Riwayat Tontonan", key: "watched" },
    { icon: "💾", label: "Video Disimpan", key: "saved" },
  ];

  /* ─── Layout ────────────────────────────────────── */
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f0f4ff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
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
              📚 LearnPath
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginTop: "4px" }}
            >
              AI Learning Platform
            </div>
          </Link>
        </div>

        {/* Nav Tabs */}
        <nav style={{ flex: 1, padding: "24px 16px" }}>
          {navItems.map((item) => {
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => switchTab(item.key)}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  color: active ? "#fff" : "rgba(255,255,255,0.55)",
                  background: active
                    ? "rgba(99,102,241,0.35)"
                    : "transparent",
                  border: active
                    ? "1px solid rgba(99,102,241,0.4)"
                    : "1px solid transparent",
                  fontSize: "0.9rem",
                  fontWeight: active ? 700 : 400,
                  marginBottom: "6px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  transition:
                    "background 0.2s ease, color 0.2s ease, border 0.2s ease",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {active && (
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#818cf8",
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            );
          })}
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
                background: "linear-gradient(135deg, #667eea, #764ba2)",
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
                style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}
              >
                Member
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
      <main
        style={{
          flex: 1,
          padding: "40px",
          overflowY: "auto",
          opacity: fading ? 0 : 1,
          transform: fading ? "translateY(10px)" : "translateY(0)",
          transition: "opacity 0.18s ease, transform 0.18s ease",
        }}
      >
        {/* ── TAB: Dashboard ── */}
        {tab === "dashboard" && (
          <div>
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
                Halo, {session?.name}! 👋
              </h1>
              <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                Lanjutkan perjalanan belajarmu hari ini.
              </p>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "20px",
                marginBottom: "32px",
              }}
            >
              {[
                {
                  icon: "🎬",
                  label: "Video Disimpan",
                  value: savedVideos.length,
                  color: "#6366f1",
                  bg: "#eef2ff",
                },
                {
                  icon: "📚",
                  label: "Topik Dipelajari",
                  value: uniqueTopics,
                  color: "#10b981",
                  bg: "#ecfdf5",
                },
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
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: stat.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.4rem",
                      marginBottom: "12px",
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 800,
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#6b7280",
                      marginTop: "4px",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "24px",
                padding: "28px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: "6px",
                  }}
                >
                  🚀 Siap belajar hari ini?
                </h2>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  Temukan roadmap belajar AI yang dipersonalisasi untukmu.
                </p>
              </div>
              <Link
                href="/"
                style={{
                  background: "#fff",
                  color: "#6366f1",
                  borderRadius: "14px",
                  padding: "12px 28px",
                  fontWeight: 700,
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                Cari Materi →
              </Link>
            </div>

            {/* Preview 3 video terakhir */}
            {watchedVideos.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "24px",
                  padding: "28px 32px",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: "#1e1b4b",
                    }}
                  >
                    🎬 Baru Ditonton
                  </h2>
                  <button
                    onClick={() => switchTab("watched")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6366f1",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Lihat Semua →
                  </button>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {watchedVideos.slice(0, 3).map((h) => (
                    <div key={h._id} style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          zIndex: 10,
                          background: "rgba(0,0,0,0.65)",
                          color: "#fff",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        {h.topic}
                      </div>
                      <VideoCard
                        title={h.videoTitle}
                        thumbnail={h.thumbnail}
                        url={h.videoUrl}
                        videoId={getVideoId(h.videoUrl)}
                        topic={h.topic}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Tersimpan — 3 items only */}
            {savedVideos.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "24px",
                  padding: "28px 32px",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.08)",
                  marginTop: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 800,
                        color: "#1e1b4b",
                        marginBottom: "4px",
                      }}
                    >
                      💾 Video Tersimpan
                    </h2>
                    <p style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                      {savedVideos.length} video • {uniqueTopics} topik
                    </p>
                  </div>
                  <button
                    onClick={() => switchTab("saved")}
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "8px 20px",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Kelola Riwayat →
                  </button>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {savedVideos.slice(0, 3).map((h) => (
                    <div key={h._id} style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          zIndex: 10,
                          background: "rgba(0,0,0,0.65)",
                          color: "#fff",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        {h.topic}
                      </div>
                      <VideoCard
                        title={h.videoTitle}
                        thumbnail={h.thumbnail}
                        url={h.videoUrl}
                        videoId={getVideoId(h.videoUrl)}
                        topic={h.topic}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Riwayat Tontonan ── */}
        {tab === "watched" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "32px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: "#1e1b4b",
                    marginBottom: "6px",
                  }}
                >
                  🎬 Riwayat Tontonan
                </h1>
                <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                  {watchedVideos.length} video baru ditonton
                </p>
              </div>
              <Link
                href="/"
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "12px",
                  padding: "10px 24px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                }}
              >
                + Cari Materi
              </Link>
            </div>

            {watchedVideos.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "24px",
                  padding: "80px 40px",
                  textAlign: "center",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.08)",
                }}
              >
                <div style={{ fontSize: "3.5rem", marginBottom: "14px" }}>
                  🎬
                </div>
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Belum ada riwayat tontonan
                </p>
                <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                  Tonton video dari halaman roadmap untuk melihatnya di sini.
                </p>
              </div>
            ) : (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "24px",
                  padding: "28px 32px",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.08)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {watchedVideos.map((h) => (
                    <div key={h._id} style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          zIndex: 10,
                          background: "rgba(0,0,0,0.65)",
                          color: "#fff",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        {h.topic}
                      </div>
                      <VideoCard
                        title={h.videoTitle}
                        thumbnail={h.thumbnail}
                        url={h.videoUrl}
                        videoId={getVideoId(h.videoUrl)}
                        topic={h.topic}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Video Disimpan ── */}
        {tab === "saved" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "32px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: "#1e1b4b",
                    marginBottom: "6px",
                  }}
                >
                  💾 Video Disimpan
                </h1>
                <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                  {savedVideos.length} video disimpan dari {uniqueTopics} topik
                </p>
              </div>
              <Link
                href="/"
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "12px",
                  padding: "10px 24px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                }}
              >
                + Cari Materi
              </Link>
            </div>

            {savedVideos.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "24px",
                  padding: "80px 40px",
                  textAlign: "center",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.08)",
                }}
              >
                <div style={{ fontSize: "3.5rem", marginBottom: "14px" }}>
                  💾
                </div>
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Belum ada video disimpan
                </p>
                <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                  Simpan video dari halaman roadmap atau video player untuk melihatnya di sini.
                </p>
              </div>
            ) : (
              <div
                style={{
                  background: "#fff",
                  borderRadius: "24px",
                  padding: "28px 32px",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.08)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {savedVideos.map((h) => (
                    <div key={h._id} style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          zIndex: 10,
                          background: "rgba(0,0,0,0.65)",
                          color: "#fff",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        {h.topic}
                      </div>
                      <VideoCard
                        title={h.videoTitle}
                        thumbnail={h.thumbnail}
                        url={h.videoUrl}
                        videoId={getVideoId(h.videoUrl)}
                        topic={h.topic}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
}
