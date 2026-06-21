"use client";
import React, { createContext, useCallback, useContext, useRef, useState } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastColors: Record<ToastType, { bg: string; icon: string; bar: string }> = {
  success: { bg: "rgba(180,210,160,0.18)", icon: "✓", bar: "#a8c49f" },
  error:   { bg: "rgba(220,80,80,0.12)",  icon: "✕", bar: "rgba(200,60,60,0.7)" },
  warning: { bg: "rgba(229,190,100,0.18)", icon: "!", bar: "#D4A017" },
  info:    { bg: "rgba(44,40,32,0.07)",    icon: "i", bar: "#B8A88A" },
};

const glass = {
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: "0 8px 40px rgba(44,40,32,0.14)",
} as const;

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const c = toastColors[item.type];
  return (
    <div style={{ ...glass, background: c.bg, borderRadius: 16, padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 12, minWidth: 260, maxWidth: 380,
        animation: "toastIn 0.26s cubic-bezier(.22,.68,0,1.4)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: c.bar, borderRadius: "16px 0 0 16px" }} />
      <span style={{ width: 26, height: 26, borderRadius: "50%", background: c.bar, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, flexShrink: 0, marginLeft: 6 }}>
        {c.icon}
      </span>
      <p style={{ fontSize: 13.5, color: "#2C2820", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.5, flex: 1 }}>
        {item.message}
      </p>
      <button onClick={() => onDismiss(item.id)} aria-label="Dismiss"
        style={{ background: "none", border: "none", cursor: "pointer", color: "#B8A88A", fontSize: 14, padding: 2, lineHeight: 1, flexShrink: 0 }}>
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "info", duration = 3500) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div aria-live="polite" style={{ position: "fixed", bottom: 28, right: 28, zIndex: 99999,
          display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
        <style>{`
          @keyframes toastIn {
            from { opacity: 0; transform: translateX(32px) scale(0.94); }
            to   { opacity: 1; transform: translateX(0) scale(1); }
          }
        `}</style>
        {toasts.map((t) => <ToastCard key={t.id} item={t} onDismiss={dismiss} />)}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastDemo({ message, type = "info" }: { message: string; type?: ToastType }) {
  const item: ToastItem = { id: 0, message, type };
  return <ToastCard item={item} onDismiss={() => {}} />;
}

export default ToastProvider;