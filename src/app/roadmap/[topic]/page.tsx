"use client";

import VideoCard from "@/src/components/VideoCard";
import { useEffect, useState } from "react";

interface RoadmapData {
  beginner: string[];
  intermediate: string[];
  advanced: string[];
}

const LEVEL_CONFIG = {
  beginner: {
    label: "Beginner",
    icon: "🌱",
    color: "#10b981",
    bg: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
    accent: "#6ee7b7",
    badge: "linear-gradient(135deg, #10b981, #059669)",
  },
  intermediate: {
    label: "Intermediate",
    icon: "⚡",
    color: "#f59e0b",
    bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    accent: "#fcd34d",
    badge: "linear-gradient(135deg, #f59e0b, #d97706)",
  },
  advanced: {
    label: "Advanced",
    icon: "🚀",
    color: "#6366f1",
    bg: "linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%)",
    accent: "#a5b4fc",
    badge: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  },
};

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [videos, setVideos] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [fromSearch, setFromSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchVideo = async (keyword: string) => {
    const response = await fetch("/api/youtube", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: keyword }),
    });
    const data = await response.json();
    return data.items?.[0];
  };

  useEffect(() => {
    const path = window.location.pathname;
    const topicSlug = decodeURIComponent(path.split("/").pop() || "");
    const params = new URLSearchParams(window.location.search);
    const lvl = params.get("level") || "beginner";

    const isSearchMode = lvl === "all";
    setFromSearch(isSearchMode);

    // Pretty-print topic name
    const topicName = topicSlug
      .replaceAll("-", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    setTopic(topicName);
    setLevel(isSearchMode ? "all" : lvl);

    // Send "beginner" as default level hint when mode is "all"
    const apiLevel = isSearchMode ? "beginner" : lvl;

    fetch("/api/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: topicSlug, level: apiLevel }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        // Cek jika API gagal atau roadmap tidak ada
        if (!data.success || !data.roadmap) {
          setError(data.error || "AI gagal menghasilkan roadmap. Coba lagi.");
          setLoading(false);
          return;
        }

        const cleaned = data.roadmap
          .replace("```json", "")
          .replace("```", "")
          .trim();

        let roadmapData: RoadmapData;
        try {
          roadmapData = JSON.parse(cleaned);
        } catch {
          setError("Format roadmap tidak valid. Silakan coba lagi.");
          setLoading(false);
          return;
        }

        setRoadmap(roadmapData);

        const allVideos: any = {};
        for (const lv of ["beginner", "intermediate", "advanced"]) {
          allVideos[lv] = [];
          for (const item of roadmapData[lv] ?? []) {
            const video = await searchVideo(item);
            if (video) allVideos[lv].push(video);
          }
        }

        setVideos(allVideos);
        setLoading(false);
      })
      .catch((err) => {
        setError("Terjadi kesalahan jaringan: " + err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            border: "4px solid rgba(255,255,255,0.3)",
            borderTop: "4px solid #fff",
            borderRadius: "50%",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <p style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 600 }}>
          🤖 AI sedang menyiapkan roadmap-mu…
        </p>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
          Mengumpulkan video terbaik untuk kamu
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "4rem" }}>⚠️</div>
        <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700 }}>
          Gagal Memuat Roadmap
        </h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", maxWidth: "480px" }}>
          {error}
        </p>
        <a
          href="/"
          style={{
            marginTop: "8px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: "999px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          ← Kembali ke Home
        </a>
      </div>
    );


  return (
    <main style={{ minHeight: "100vh" }}>
      {/* ── Header ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "56px 40px 90px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"280px", height:"280px", borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-40px", left:"30px", width:"180px", height:"180px", borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <a
            href="/"
            style={{ display:"inline-flex", alignItems:"center", gap:"6px", color:"rgba(255,255,255,0.8)", textDecoration:"none", fontSize:"0.9rem", fontWeight:500, marginBottom:"24px", transition:"color 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.8)")}
          >
            ← Kembali ke Home
          </a>

          <h1
            style={{ fontSize:"clamp(1.8rem, 4vw, 2.8rem)", fontWeight:800, color:"#fff", marginBottom:"12px", textShadow:"0 2px 16px rgba(0,0,0,0.15)" }}
          >
            📚 {topic}
          </h1>

          <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
            {fromSearch ? (
              <span style={{ background:"rgba(253,230,138,0.25)", border:"1px solid rgba(253,230,138,0.5)", color:"#fde68a", borderRadius:"999px", padding:"5px 16px", fontSize:"0.82rem", fontWeight:600, backdropFilter:"blur(6px)" }}>
                🔍 Hasil Pencarian
              </span>
            ) : (
              <span style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.35)", color:"#fff", borderRadius:"999px", padding:"5px 16px", fontSize:"0.82rem", fontWeight:600, backdropFilter:"blur(6px)" }}>
                Level Mulai: {level.charAt(0).toUpperCase() + level.slice(1)}
              </span>
            )}
            <span style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.35)", color:"#fff", borderRadius:"999px", padding:"5px 16px", fontSize:"0.82rem", fontWeight:600, backdropFilter:"blur(6px)" }}>
              🎬 Learning Roadmap
            </span>
            <span style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.35)", color:"#fff", borderRadius:"999px", padding:"5px 16px", fontSize:"0.82rem", fontWeight:600, backdropFilter:"blur(6px)" }}>
              3 Level tersedia
            </span>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "-44px auto 0",
          padding: "0 32px 80px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {(["beginner", "intermediate", "advanced"] as const).map((lv) => {
          const cfg = LEVEL_CONFIG[lv];
          const lvVideos = videos[lv] || [];

          return (
            <section
              key={lv}
              style={{
                marginBottom: "32px",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 4px 32px rgba(99,102,241,0.09)",
              }}
            >
              {/* Section header */}
              <div
                style={{
                  background: cfg.bg,
                  borderBottom: `2px solid ${cfg.accent}`,
                  padding: "22px 32px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <span style={{ fontSize: "1.8rem" }}>{cfg.icon}</span>
                <div>
                  <h2 style={{ fontSize:"1.2rem", fontWeight:800, color:"#1e1b4b" }}>
                    {cfg.label}
                  </h2>
                  <p style={{ color:"#6b7280", fontSize:"0.82rem", marginTop:"2px" }}>
                    {lvVideos.length} video belajar tersedia
                  </p>
                </div>
                <span
                  style={{
                    marginLeft: "auto",
                    background: cfg.badge,
                    color: "#fff",
                    borderRadius: "999px",
                    padding: "5px 18px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  {cfg.label.toUpperCase()}
                </span>
              </div>

              {/* Videos grid */}
              <div style={{ background: "#fff", padding: "28px 32px" }}>
                {lvVideos.length === 0 ? (
                  <p style={{ color:"#9ca3af", textAlign:"center", padding:"24px 0", fontSize:"0.9rem" }}>
                    Tidak ada video tersedia untuk level ini.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {lvVideos.map((video: any) => (
                      <VideoCard
                        key={video.id.videoId}
                        title={video.snippet.title}
                        thumbnail={video.snippet.thumbnails.high.url}
                        url={`https://youtube.com/watch?v=${video.id.videoId}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}