"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(92%, 1100px)",
        zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.65)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.9)",
        borderRadius: 20,
        boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.08)" : "0 4px 24px rgba(0,0,0,0.04)",
        padding: "12px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
      }}
    >
      {/* Brand */}
      <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <img src="/logo.png" alt="Gevora" style={{ height: 56, width: "auto", display: "block" }} />
      </Link>

      {/* Desktop links */}
      <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="hidden md:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{ fontSize: 13.5, fontWeight: 400, color: "#7A7060", textDecoration: "none", letterSpacing: "0.01em", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2C2820")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7A7060")}
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/login"
          style={{ fontSize: 13.5, fontWeight: 500, background: "#2C2820", color: "#FAF7EE", padding: "9px 22px", borderRadius: 12, textDecoration: "none", transition: "all 0.25s", display: "inline-block" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#D4A017"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(212,160,23,0.4)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#2C2820"; e.currentTarget.style.boxShadow = "none"; }}
        >
          Sign in
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#2C2820", padding: 4 }}
        className="flex md:hidden"
        aria-label="Toggle menu"
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {menuOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: 16, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14,
        }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ fontSize: 14, color: "#7A7060", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setMenuOpen(false)}
            style={{ fontSize: 14, fontWeight: 500, background: "#2C2820", color: "#FAF7EE", padding: "10px 18px", borderRadius: 12, textDecoration: "none", textAlign: "center" }}>
            Sign in
          </Link>
        </div>
      )}
    </nav>
  );
}