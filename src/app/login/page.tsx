"use client";

import { useActionState } from "react";
import { login } from "@/src/app/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"320px", height:"320px", borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-60px", left:"-40px", width:"240px", height:"240px", borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />

      <div
        style={{
          background: "#fff",
          borderRadius: "28px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 24px 80px rgba(99,102,241,0.25)",
          position: "relative",
          zIndex: 1,
          animation: "fadeInUp 0.4s ease-out",
        }}
      >
        {/* Logo & Title */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🎓</div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1e1b4b", marginBottom: "6px" }}>
            Masuk ke <span style={{ color: "#6366f1" }}>LearnPath</span>
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            Selamat datang kembali! Masuk untuk melanjutkan belajar.
          </p>
        </div>

        {/* Error umum */}
        {state?.errors?.general && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "20px",
              color: "#dc2626",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            ⚠️ {state.errors.general[0]}
          </div>
        )}

        <form action={action} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: state?.errors?.email ? "2px solid #ef4444" : "2px solid #e5e7eb",
                fontSize: "0.95rem",
                color: "#1e1b4b",
                fontFamily: "inherit",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = state?.errors?.email ? "#ef4444" : "#e5e7eb"; }}
            />
            {state?.errors?.email && (
              <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>
                {state.errors.email[0]}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Masukkan password"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: state?.errors?.password ? "2px solid #ef4444" : "2px solid #e5e7eb",
                fontSize: "0.95rem",
                color: "#1e1b4b",
                fontFamily: "inherit",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#6366f1"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = state?.errors?.password ? "#ef4444" : "#e5e7eb"; }}
            />
            {state?.errors?.password && (
              <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "4px" }}>
                {state.errors.password[0]}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            style={{
              background: pending
                ? "#e5e7eb"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: pending ? "#9ca3af" : "#fff",
              border: "none",
              borderRadius: "14px",
              padding: "14px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: pending ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              fontFamily: "inherit",
              marginTop: "4px",
            }}
            onMouseEnter={(e) => {
              if (!pending) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            {pending ? "⏳ Memproses..." : "Masuk →"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            Belum punya akun?{" "}
            <Link
              href="/register"
              style={{ color: "#6366f1", fontWeight: 700, textDecoration: "none" }}
            >
              Daftar sekarang
            </Link>
          </p>
          <p style={{ marginTop: "10px" }}>
            <Link
              href="/"
              style={{ color: "#9ca3af", fontSize: "0.82rem", textDecoration: "none" }}
            >
              ← Kembali ke Beranda
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
