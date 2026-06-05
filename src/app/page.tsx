"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopicCard from "@/src/components/TopicCard";
import KnowledgeModal from "@/src/components/KnowledgeModal";
import { topics } from "@/src/data/topics";

export default function HomePage() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState("");
  const [openModal, setOpenModal] = useState(false);

  // Search bar state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const handleTopicClick = (title: string) => {
    setSelectedTopic(title);
    setOpenModal(true);
  };

  const handleContinue = (level: string) => {
    const slug = selectedTopic.toLowerCase().replaceAll(" ", "-");
    router.push(`/roadmap/${slug}?level=${level}`);
  };

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    const slug = q.toLowerCase().replaceAll(" ", "-");
    router.push(`/roadmap/${slug}?level=all`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <main style={{ minHeight: "100vh", padding: "0" }}>
      {/* ── Hero Section ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "72px 40px 120px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-80px", left:"-40px", width:"250px", height:"250px", borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />

        {/* ── Navbar Login/Register ── */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "32px",
            display: "flex",
            gap: "10px",
            zIndex: 10,
          }}
        >
          <a
            href="/login"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
              backdropFilter: "blur(8px)",
              transition: "background 0.2s",
            }}
          >
            Masuk
          </a>
          <a
            href="/register"
            style={{
              background: "#fff",
              color: "#6366f1",
              borderRadius: "10px",
              padding: "8px 20px",
              fontSize: "0.85rem",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              transition: "transform 0.2s",
            }}
          >
            Daftar Gratis ✨
          </a>
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto" }}>
          {/* Badge */}
          <span style={{ display:"inline-block", background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.35)", color:"#fff", borderRadius:"999px", padding:"6px 20px", fontSize:"13px", fontWeight:600, letterSpacing:"0.08em", marginBottom:"24px", backdropFilter:"blur(8px)" }}>
            ✨ AI-Powered Learning Platform
          </span>

          <h1 style={{ fontSize:"clamp(2.2rem, 5vw, 3.6rem)", fontWeight:800, color:"#fff", lineHeight:1.15, marginBottom:"12px", textShadow:"0 2px 20px rgba(0,0,0,0.15)" }}>
            LearnPath <span style={{ color:"#fde68a" }}>AI</span>
          </h1>

          <p style={{ fontSize:"clamp(0.95rem, 2vw, 1.1rem)", color:"rgba(255,255,255,0.85)", marginBottom:"36px", lineHeight:1.7 }}>
            Pilih topik atau cari materi apapun — AI akan merancang roadmap belajarmu 🚀
          </p>

          {/* ── Search Bar ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0",
              background: "#fff",
              borderRadius: "18px",
              padding: "6px 6px 6px 20px",
              boxShadow: searchFocused
                ? "0 0 0 4px rgba(255,255,255,0.4), 0 16px 48px rgba(0,0,0,0.2)"
                : "0 8px 40px rgba(0,0,0,0.18)",
              transition: "box-shadow 0.25s ease",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {/* Search icon */}
            <span style={{ fontSize:"1.2rem", marginRight:"10px", opacity:0.5 }}>🔍</span>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Cari materi apa saja…"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "1rem",
                fontWeight: 500,
                color: "#1e1b4b",
                background: "transparent",
                fontFamily: "inherit",
                padding: "10px 0",
              }}
            />

            <button
              id="btn-cari-materi"
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              style={{
                background: searchQuery.trim()
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "#e5e7eb",
                color: searchQuery.trim() ? "#fff" : "#9ca3af",
                border: "none",
                borderRadius: "13px",
                padding: "12px 28px",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: searchQuery.trim() ? "pointer" : "not-allowed",
                transition: "all 0.25s ease",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                transform: "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!searchQuery.trim()) return;
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(102,126,234,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              Cari Materi →
            </button>
          </div>

          {/* Quick suggestions */}
          <div style={{ marginTop:"16px", display:"flex", flexWrap:"wrap", gap:"8px", justifyContent:"center" }}>
            {["React.js", "Node.js", "Flutter", "SQL", "DevOps"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  const slug = s.toLowerCase().replaceAll(".", "-").replaceAll(" ", "-");
                  router.push(`/roadmap/${slug}?level=all`);
                }}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff",
                  borderRadius: "999px",
                  padding: "5px 16px",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                  transition: "background 0.2s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.28)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Hide search button on mobile */}
        <style>{`
          @media (max-width: 640px) {
            #btn-cari-materi { display: none !important; }
          }
        `}</style>
      </section>

      {/* ── Topic Cards Section ── */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "-48px auto 0",
          padding: "0 32px 80px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 8px 48px rgba(99,102,241,0.1)",
            marginBottom: "28px",
          }}
        >
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", marginBottom:"24px" }}>
            <div>
              <h2 style={{ fontSize:"1.1rem", fontWeight:700, color:"#6366f1", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"4px" }}>
                🎯 Topik Populer
              </h2>
              <p style={{ color:"#6b7280", fontSize:"0.88rem" }}>
                Klik topik untuk memilih level belajarmu
              </p>
            </div>
            <span style={{ fontSize:"0.8rem", color:"#9ca3af", background:"#f3f4f6", padding:"4px 12px", borderRadius:"999px" }}>
              {topics.length} topik tersedia
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: "18px",
            }}
          >
            {topics.map((topic, i) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={i}
                onClick={() => handleTopicClick(topic.title)}
              />
            ))}
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div
          style={{
            display: "grid",
            justifyContent: "center",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            { icon: "🤖", label: "AI Powered", desc: "Roadmap dibuat AI" },
            { icon: "🎬", label: "Video Belajar", desc: "Dari YouTube terbaik" },
            { icon: "📈", label: "3 Level", desc: "Beginner s/d Advanced" },
            { icon: "⚡", label: "Gratis", desc: "100% Tanpa Biaya" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.08)",
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>{stat.icon}</div>
              <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: "0.95rem" }}>{stat.label}</div>
              <div style={{ color: "#9ca3af", fontSize: "0.8rem", marginTop: "2px" }}>{stat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <KnowledgeModal
        topic={selectedTopic}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onContinue={handleContinue}
      />
    </main>
  );
}