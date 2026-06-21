import React from "react";

type LoaderVariant = "spinner" | "skeleton";
type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  lines?: number;
  label?: string;
}

const spinnerSizes: Record<LoaderSize, { width: number; stroke: number }> = {
  sm: { width: 20, stroke: 2.5 },
  md: { width: 36, stroke: 3 },
  lg: { width: 52, stroke: 3.5 },
};

function Spinner({ size = "md", label = "Loading…" }: { size?: LoaderSize; label?: string }) {
  const { width, stroke } = spinnerSizes[size];
  const r = (width - stroke * 2) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div role="status" aria-label={label} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @keyframes gevora-spin { to { transform: rotate(360deg); } }
        .gevora-spinner { animation: gevora-spin 0.85s linear infinite; transform-origin: center; }
      `}</style>
      <svg width={width} height={width} viewBox={`0 0 ${width} ${width}`} fill="none" className="gevora-spinner">
        <circle cx={width / 2} cy={width / 2} r={r} stroke="rgba(212,160,23,0.18)" strokeWidth={stroke} />
        <circle cx={width / 2} cy={width / 2} r={r} stroke="#D4A017" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * 0.72} />
      </svg>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        {label}
      </span>
    </div>
  );
}

function Skeleton({ lines = 3, label = "Loading…" }: { lines?: number; label?: string }) {
  return (
    <div role="status" aria-label={label} style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
      <style>{`
        @keyframes gevora-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.38; } }
        .gevora-skeleton { animation: gevora-pulse 1.6s ease-in-out infinite; }
      `}</style>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="gevora-skeleton"
          style={{ height: 14, borderRadius: 8, background: "rgba(44,40,32,0.09)",
            width: i === lines - 1 ? "62%" : "100%", animationDelay: `${i * 0.12}s` }} />
      ))}
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        {label}
      </span>
    </div>
  );
}

export default function Loader({ variant = "spinner", size = "md", lines = 3, label = "Loading…" }: LoaderProps) {
  if (variant === "skeleton") return <Skeleton lines={lines} label={label} />;
  return <Spinner size={size} label={label} />;
}