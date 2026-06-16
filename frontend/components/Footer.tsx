"use client";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/login", label: "Login" },
];

export default function Footer() {
  return (
    <footer style={{ position: "relative", zIndex: 1, padding: "0 24px 32px" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.85)",
          borderRadius: 20,
          padding: "20px 40px",
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap" as const,
          gap: 16,
          boxShadow: "0 4px 20px rgba(44,40,32,0.04)",
        }}
      >
        <img src="/logo.png" alt="Gevora" style={{ height: 44, width: "auto", display: "block" }} />

        <div style={{ display: "flex", gap: 32 }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ fontSize: 13, color: "#B8A88A", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#2C2820")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#B8A88A")}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "#C8BCA8" }}>© 2026 Gevora. All rights reserved.</p>
      </div>
    </footer>
  );
}