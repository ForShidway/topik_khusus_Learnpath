"use client";

interface Props {
  title: string;
  thumbnail: string;
  url: string;
  onSave?: (e: React.MouseEvent) => void;
  isSaved?: boolean;
}

export default function VideoCard({ title, thumbnail, url, onSave, isSaved }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        borderRadius: "18px",
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 4px 20px rgba(99,102,241,0.09)",
        border: "1px solid rgba(99,102,241,0.08)",
        textDecoration: "none",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 16px 40px rgba(99,102,241,0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(99,102,241,0.09)";
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={thumbnail}
          alt={title}
          style={{
            width: "100%",
            aspectRatio: "16/9",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.3s ease",
          }}
        />
        {/* Play overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(99,102,241,0.0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.25s ease",
          }}
          className="video-overlay"
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              opacity: 0,
              transition: "opacity 0.25s ease",
            }}
            className="play-btn"
          >
            ▶
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 16px" }}>
        <p
          style={{
            fontWeight: 600,
            color: "#1e1b4b",
            fontSize: "0.88rem",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            marginBottom: "10px",
          }}
        >
          {title}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: "999px",
            }}
          >
            ▶ Tonton
          </span>

          {onSave && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onSave(e);
              }}
              disabled={isSaved}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: isSaved ? "#10b981" : "#f3f4f6",
                color: isSaved ? "#fff" : "#4b5563",
                border: "none",
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "999px",
                cursor: isSaved ? "default" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {isSaved ? "✅ Tersimpan" : "💾 Simpan"}
            </button>
          )}
        </div>
      </div>

      <style>{`
        a:hover .video-overlay { background: rgba(99,102,241,0.25) !important; }
        a:hover .play-btn      { opacity: 1 !important; }
      `}</style>
    </a>
  );
}