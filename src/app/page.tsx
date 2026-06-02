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

  const handleTopicClick = (title: string) => {
    setSelectedTopic(title);
    setOpenModal(true);
  };

  const handleContinue = (level: string) => {
    const slug = selectedTopic.toLowerCase().replaceAll(" ", "-");
    router.push(`/roadmap/${slug}?level=${level}`);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "0",
      }}
    >
      {/* ── Hero Section ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "80px 40px 100px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-40px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <span
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",
              borderRadius: "999px",
              padding: "6px 20px",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              marginBottom: "24px",
              backdropFilter: "blur(8px)",
            }}
          >
            ✨ AI-Powered Learning Platform
          </span>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: "16px",
              textShadow: "0 2px 20px rgba(0,0,0,0.15)",
            }}
          >
            LearnPath <span style={{ color: "#fde68a" }}>AI</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "rgba(255,255,255,0.85)",
              maxWidth: "520px",
              margin: "0 auto 12px",
              lineHeight: 1.7,
            }}
          >
            Pilih topik yang ingin kamu pelajari dan biarkan AI merancang
            roadmap belajar yang personal untukmu 🚀
          </p>
        </div>
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
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "#6366f1",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "6px",
            }}
          >
            🎯 Mulai Belajar
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "28px", fontSize: "0.95rem" }}>
            Klik salah satu topik di bawah ini untuk memulai perjalanan belajarmu
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
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

        {/* ── Stats / Info Row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
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
              <div style={{ fontSize: "1.8rem", marginBottom: "6px" }}>
                {stat.icon}
              </div>
              <div style={{ fontWeight: 700, color: "#1e1b4b", fontSize: "0.95rem" }}>
                {stat.label}
              </div>
              <div style={{ color: "#9ca3af", fontSize: "0.8rem", marginTop: "2px" }}>
                {stat.desc}
              </div>
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