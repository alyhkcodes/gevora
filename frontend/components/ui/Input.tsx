import React from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export default function Input({ label, placeholder, type = "text", value, onChange, error, disabled = false, name, id, className }: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(250,247,238,0.8)",
    border: error ? "1px solid rgba(220,60,60,0.6)" : "1px solid rgba(255,255,255,0.9)",
    borderRadius: 12, padding: "13px 16px", fontSize: 14, color: "#2C2820",
    outline: "none", fontFamily: "var(--font-inter), sans-serif",
    boxShadow: error ? "inset 0 2px 8px rgba(220,60,60,0.08)" : "inset 0 2px 8px rgba(44,40,32,0.04)",
    opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "text",
    transition: "border 0.2s, box-shadow 0.2s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }} className={className}>
      {label && (
        <label htmlFor={inputId} style={{ display: "block", fontSize: 11, fontWeight: 600,
          color: error ? "rgba(220,60,60,0.85)" : "#B8A88A", letterSpacing: "0.08em",
          textTransform: "uppercase", fontFamily: "var(--font-inter), sans-serif" }}>
          {label}
        </label>
      )}
      <input
        id={inputId} name={name} type={type} placeholder={placeholder}
        value={value} onChange={onChange} disabled={disabled} style={inputStyle}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.border = "1px solid rgba(212,160,23,0.5)";
            e.currentTarget.style.boxShadow = "inset 0 2px 8px rgba(44,40,32,0.04), 0 0 0 3px rgba(212,160,23,0.12)";
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = error ? "1px solid rgba(220,60,60,0.6)" : "1px solid rgba(255,255,255,0.9)";
          e.currentTarget.style.boxShadow = error ? "inset 0 2px 8px rgba(220,60,60,0.08)" : "inset 0 2px 8px rgba(44,40,32,0.04)";
        }}
      />
      {error && (
        <p style={{ fontSize: 11, color: "rgba(200,50,50,0.9)", fontFamily: "var(--font-inter), sans-serif", marginTop: 2 }}>
          {error}
        </p>
      )}
    </div>
  );
}