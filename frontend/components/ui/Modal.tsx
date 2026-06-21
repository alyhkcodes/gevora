"use client";
import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: number;
}

const glass = {
  background: "rgba(255,255,255,0.82)",
  backdropFilter: "blur(32px)",
  WebkitBackdropFilter: "blur(32px)",
  border: "1px solid rgba(255,255,255,0.95)",
  boxShadow: "0 24px 64px rgba(44,40,32,0.18)",
} as const;

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 520 }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const panel = panelRef.current;
    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (focusable.length === 0) { e.preventDefault(); return; }
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first?.focus(); } }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} role="dialog" aria-modal="true" aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center",
        justifyContent: "center", padding: "24px", background: "rgba(44,40,32,0.38)",
        backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", animation: "fadeIn 0.18s ease" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(18px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
      <div ref={panelRef} style={{ ...glass, borderRadius: 24, padding: "36px 36px", width: "100%", maxWidth, animation: "slideUp 0.22s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 id="modal-title" style={{ fontFamily: "var(--font-playfair), serif", fontSize: 22, fontWeight: 400, color: "#2C2820", letterSpacing: "-0.02em" }}>
            {title}
          </h2>
          <button onClick={onClose} aria-label="Close modal"
            style={{ background: "rgba(44,40,32,0.06)", border: "none", borderRadius: "50%", width: 34, height: 34,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              color: "#7A7060", fontSize: 18, lineHeight: 1, transition: "background 0.18s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(44,40,32,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(44,40,32,0.06)")}>
            ✕
          </button>
        </div>
        <div style={{ color: "#7A7060", fontSize: 14, lineHeight: 1.7, fontFamily: "var(--font-inter), sans-serif" }}>
          {children}
        </div>
      </div>
    </div>
  );
}