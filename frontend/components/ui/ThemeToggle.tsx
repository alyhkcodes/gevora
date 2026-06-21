"use client";
import React, { useEffect, useState } from "react";

const STORAGE_KEY = "gevora-theme";

export default function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <button onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: 8,
        background: isDark ? "rgba(255,255,255,0.08)" : "rgba(44,40,32,0.06)",
        border: isDark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(44,40,32,0.1)",
        borderRadius: 100, padding: "7px 14px", cursor: "pointer", transition: "all 0.25s ease",
        fontFamily: "var(--font-inter), sans-serif", fontSize: 12, fontWeight: 500,
        color: isDark ? "rgba(250,247,238,0.85)" : "#7A7060",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.14)" : "rgba(212,160,23,0.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(44,40,32,0.06)"; }}>
      <div style={{ width: 36, height: 20, borderRadius: 100,
          background: isDark ? "#D4A017" : "rgba(44,40,32,0.15)",
          position: "relative", transition: "background 0.25s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 3, left: isDark ? 19 : 3, width: 14, height: 14,
            borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            transition: "left 0.22s cubic-bezier(.34,1.56,.64,1)" }} />
      </div>
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}