"use client";

import { Topic } from "@/src/types/topic";

interface Props {
  topic: Topic;
  index: number;
  onClick: () => void;
}

const GRADIENTS = [
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
];

const ICONS = ["💻", "🌐", "🔐", "📊", "🎨"];

export default function TopicCard({ topic, index, onClick }: Props) {
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const icon = ICONS[index % ICONS.length];

  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        borderRadius: "20px",
        background: gradient,
        padding: "28px 20px",
        textAlign: "center",
        boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px) scale(1.03)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0) scale(1)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.12)";
      }}
    >
      {/* Decorative circle */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          pointerEvents: "none",
        }}
      />

      <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>{icon}</div>

      <h2
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.3,
          textShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }}
      >
        {topic.title}
      </h2>

      <div
        style={{
          marginTop: "14px",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          background: "rgba(255,255,255,0.25)",
          borderRadius: "999px",
          padding: "4px 14px",
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "#fff",
          backdropFilter: "blur(4px)",
        }}
      >
        Mulai →
      </div>
    </div>
  );
}