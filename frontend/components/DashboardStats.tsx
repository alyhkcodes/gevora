"use client";
import { motion } from "motion/react";
import GlassCard from "./GlassCard";

const stats = [
  { icon: "📋", label: "Reviews Analyzed", value: "284", trend: "+18 this week" },
  { icon: "🎫", label: "Open Issues", value: "3", trend: "2 resolved today" },
  { icon: "📈", label: "Sentiment Score", value: "8.6", trend: "+0.4 vs last week" },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
          style={{ perspective: 1000 }}
        >
          <GlassCard className="p-6">
            <div className="text-2xl mb-3">{stat.icon}</div>
            <p className="font-display text-3xl font-semibold text-ink">{stat.value}</p>
            <p className="text-ink-soft text-sm mt-1">{stat.label}</p>
            <p className="text-xs text-violet mt-2">{stat.trend}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}