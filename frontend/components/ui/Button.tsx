import React from "react";

type Variant = "primary" | "secondary" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { background: "#2C2820", color: "#FAF7EE", border: "none", boxShadow: "0 8px 32px rgba(44,40,32,0.22)" },
  secondary: { background: "#D4A017", color: "#FAF7EE", border: "none", boxShadow: "0 8px 32px rgba(212,160,23,0.35)" },
  outline: { background: "rgba(255,255,255,0.62)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", color: "#2C2820", border: "1px solid rgba(44,40,32,0.18)", boxShadow: "0 4px 16px rgba(44,40,32,0.06)" },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: "8px 18px", fontSize: 12, borderRadius: 10 },
  md: { padding: "13px 28px", fontSize: 14, borderRadius: 14 },
  lg: { padding: "17px 36px", fontSize: 16, borderRadius: 16 },
};

const hoverStyles: Record<Variant, Partial<React.CSSProperties>> = {
  primary: { background: "#D4A017", boxShadow: "0 8px 32px rgba(212,160,23,0.45)" },
  secondary: { background: "#b8880f", boxShadow: "0 8px 32px rgba(212,160,23,0.55)" },
  outline: { background: "rgba(255,255,255,0.95)", borderColor: "rgba(44,40,32,0.3)" },
};

export default function Button({ variant = "primary", size = "md", disabled = false, onClick, children, type = "button", className, style, ...rest }: ButtonProps) {
  const [hovered, setHovered] = React.useState(false);

  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "var(--font-inter), sans-serif", fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1,
    transition: "all 0.22s ease", outline: "none", letterSpacing: "0.01em",
    ...variantStyles[variant], ...sizeStyles[size],
    ...(hovered && !disabled ? hoverStyles[variant] : {}), ...style,
  };

  return (
    <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={base} className={className} {...rest}>
      {children}
    </button>
  );
}