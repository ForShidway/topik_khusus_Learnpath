import React from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "LearnPath AI",
  description: "AI Adaptive Learning Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(99,102,241,0.18)",
            },
            success: {
              iconTheme: { primary: "#6366f1", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}