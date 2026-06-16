"use client";
import { motion } from "motion/react";
import GlassCard from "./GlassCard";

const activity = [
  { time: "2h ago", text: "New 5-star review flagged for AI summary" },
  { time: "5h ago", text: "Housekeeping ticket #142 marked resolved" },
  { time: "1d ago", text: "Weekly report generated and sent" },
  { time: "2d ago", text: "Guest mentioned slow WiFi, ticket created" },
];

export default function DashboardPanels() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="lg:col-span-2"
        style={{ perspective: 1000 }}
      >
        <GlassCard className="p-6 h-full">
          <h3 className="font-display text-lg font-semibold text-ink mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            {activity.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-violet mt-1.5 shrink-0 shadow-[0_0_6px_2px_rgba(124,110,244,0.5)]" />
                <div className="flex-1">
                  <p className="text-ink">{item.text}</p>
                  <p className="text-ink-soft text-xs mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        style={{ perspective: 1000 }}
      >
        <GlassCard className="p-6 h-full flex flex-col">
          <span className="text-xs text-violet font-semibold uppercase tracking-wide mb-2">AI Insight</span>
          <h3 className="font-display text-lg font-semibold text-ink mb-3">Breakfast is your strongest signal</h3>
          <p className="text-ink-soft text-sm leading-relaxed mb-4 flex-1">
            Mentioned positively in 34% of recent reviews. Consider featuring it in your listing photos and welcome message.
          </p>
          <div className="rounded-xl bg-gradient-to-r from-violet-soft/60 to-peach-soft/60 p-3 border border-white/60">
            <p className="text-xs text-ink-soft">Updated 3 hours ago</p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}