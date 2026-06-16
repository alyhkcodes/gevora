"use client";
import { motion } from "motion/react";
import GlassCard from "./GlassCard";

interface CardProps {
  icon: string;
  title: string;
  description: string;
  tag?: string;
}

export default function Card({ icon, title, description, tag }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <GlassCard className="p-6 h-full flex flex-col">
        <div className="text-3xl mb-4">{icon}</div>
        {tag && (
          <span className="inline-block self-start text-xs font-semibold text-violet bg-violet-soft/50 px-3 py-1 rounded-full mb-3">
            {tag}
          </span>
        )}
        <h3 className="font-display text-lg font-semibold text-ink mb-2">{title}</h3>
        <p className="text-ink-soft text-sm leading-relaxed">{description}</p>
      </GlassCard>
    </motion.div>
  );
}