"use client";

interface Props {
  topic: string;
  open: boolean;
  onClose: () => void;
  onContinue: (level: string) => void;
}

const LEVELS = [
  {
    key: "beginner",
    label: "Belum Pernah Belajar",
    icon: "🌱",
    desc: "Aku masih pemula di topik ini",
    color: "#10b981",
    bg: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    border: "#6ee7b7",
  },
  {
    key: "intermediate",
    label: "Sedikit Mengetahui",
    icon: "⚡",
    desc: "Sudah tahu dasar-dasarnya",
    color: "#f59e0b",
    bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    border: "#fcd34d",
  },
  {
    key: "advanced",
    label: "Sudah Cukup Paham",
    icon: "🚀",
    desc: "Mau memperdalam lebih lanjut",
    color: "#6366f1",
    bg: "linear-gradient(135deg, #ede9fe 0%, #c7d2fe 100%)",
    border: "#a5b4fc",
  },
];

export default function KnowledgeModal({
  topic,
  open,
  onClose,
  onContinue,
}: Props) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30, 27, 75, 0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "28px",
          padding: "40px 36px",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 24px 80px rgba(99,102,241,0.22)",
          animation: "slideUp 0.3s ease",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            background: "#f3f4f6",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "#fee2e2")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6")
          }
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🎓</div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#1e1b4b",
              marginBottom: "6px",
            }}
          >
            {topic}
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.6 }}>
            Seberapa jauh pengetahuanmu tentang topik ini?
          </p>
        </div>

        {/* Level buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {LEVELS.map((lvl) => (
            <button
              key={lvl.key}
              onClick={() => onContinue(lvl.key)}
              style={{
                background: lvl.bg,
                border: `2px solid ${lvl.border}`,
                borderRadius: "16px",
                padding: "16px 20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                textAlign: "left",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
              }}
            >
              <span style={{ fontSize: "1.6rem" }}>{lvl.icon}</span>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#1e1b4b",
                    fontSize: "0.95rem",
                    marginBottom: "2px",
                  }}
                >
                  {lvl.label}
                </div>
                <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                  {lvl.desc}
                </div>
              </div>
              <span
                style={{
                  marginLeft: "auto",
                  color: lvl.color,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                →
              </span>
            </button>
          ))}
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}