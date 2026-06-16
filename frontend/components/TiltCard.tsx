"use client";
import { useRef, useState, useEffect, type ReactNode } from "react";

export default function TiltCard({
  children,
  style = {},
  className = "",
}: {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
      setTilt({ x, y });
    };
    const leave = () => setTilt({ x: 0, y: 0 });

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  const isResting = tilt.x === 0 && tilt.y === 0;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(0)`,
        transition: isResting
          ? "transform 0.6s cubic-bezier(.25,.46,.45,.94)"
          : "transform 0.08s ease-out",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}