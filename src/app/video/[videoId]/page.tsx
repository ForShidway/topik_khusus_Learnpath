"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function VideoPlayerPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const videoId = params.videoId as string;
  const title = searchParams.get("title") || "Video Pembelajaran";
  const topic = searchParams.get("topic") || "";
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.success) {
          const url = `https://youtube.com/watch?v=${videoId}`;
          setIsSaved(data.history.some((h: any) => h.videoUrl === url));
        }
      })
      .catch(() => {});
  }, [videoId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          videoTitle: title,
          videoUrl: `https://youtube.com/watch?v=${videoId}`,
          thumbnail,
        }),
      });

      if (res.status === 401) {
        toast.error("Silakan login untuk menyimpan video");
        setSaving(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        toast.success(data.alreadySaved ? "Video sudah tersimpan!" : "Video berhasil disimpan! 🎉");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    }
    setSaving(false);
  };

  const backHref = topic
    ? `/roadmap/${encodeURIComponent(topic.toLowerCase().replaceAll(" ", "-"))}`
    : "/";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f0c29 0%, #1e1b4b 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* ── Top Bar ── */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          backdropFilter: "blur(10px)",
        }}
      >
        <Link
          href={backHref}
          style={{
            color: "rgba(255,255,255,0.7)",
            textDecoration: "none",
            fontSize: "0.88rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)")}
        >
          ← Kembali
        </Link>
        <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
        <span style={{ fontSize: "1.2rem" }}>🎬</span>
        <span
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.95rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "500px",
          }}
        >
          {title}
        </span>
      </div>

      {/* ── Video + Info ── */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "36px 24px 80px" }}>
        {/* Player */}
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
            position: "relative",
            paddingTop: "56.25%", /* 16:9 */
            background: "#000",
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>

        {/* Info Row */}
        <div
          style={{
            marginTop: "24px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "18px",
            padding: "24px 28px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1 }}>
            {topic && (
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(99,102,241,0.25)",
                  border: "1px solid rgba(99,102,241,0.5)",
                  color: "#a5b4fc",
                  borderRadius: "999px",
                  padding: "4px 14px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                📚 {topic}
              </span>
            )}
            <h1
              style={{
                color: "#fff",
                fontSize: "clamp(1rem, 2.5vw, 1.35rem)",
                fontWeight: 700,
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              {title}
            </h1>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaved || saving}
            style={{
              background: isSaved
                ? "linear-gradient(135deg, #10b981, #059669)"
                : saving
                ? "rgba(255,255,255,0.1)"
                : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              padding: "13px 28px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: isSaved || saving ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.25s ease",
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontFamily: "inherit",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => {
              if (!isSaved && !saving)
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            {isSaved ? "✅ Tersimpan di Dashboard" : saving ? "⏳ Menyimpan..." : "💾 Simpan Video"}
          </button>
        </div>

        {/* Tip */}
        {!isSaved && (
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.8rem",
              marginTop: "16px",
            }}
          >
            Simpan video ini untuk menontonnya kembali di Dashboard kamu 📌
          </p>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
    </main>
  );
}
