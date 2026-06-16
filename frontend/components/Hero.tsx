"use client";
import { motion, type Variants } from "motion/react";
import GlassCard from "./GlassCard";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
    <section className="relative pt-40 pb-24 px-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center"
      >
        <motion.div variants={item} className="flex justify-center mb-6">
          <span className="glass rounded-full px-4 py-2 text-xs font-semibold text-ink-soft tracking-wide uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet shadow-[0_0_8px_2px_rgba(124,110,244,0.6)]" />
            Powered by Google Gemini AI
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-5xl md:text-7xl font-medium tracking-tight text-ink leading-[1.1] mb-6"
        >
          Guest feedback, turned into{" "}
          <span className="italic text-violet">clarity</span>.
        </motion.h1>

        <motion.p
          variants={item}
          className="text-ink-soft text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Gevora reads every review and photo your guests leave, surfaces what
          actually needs your attention, and writes the report, so running
          your homestay feels effortless.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <a
            href="/dashboard"
            className="bg-ink text-bg font-semibold px-8 py-4 rounded-2xl shadow-[0_8px_30px_rgba(32,35,46,0.25)] hover:shadow-[0_8px_30px_rgba(124,110,244,0.45)] hover:bg-violet transition-all duration-300"
          >
            Open Dashboard
          </a>
          <a
            href="/about"
            className="glass rounded-2xl px-8 py-4 font-semibold text-ink hover:bg-white/70 transition-colors duration-300"
          >
            How it works
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        variants={item}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto"
        style={{ perspective: 1200 }}
      >
        <GlassCard className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-ink-soft uppercase tracking-wide mb-1">Weekly Insight</p>
              <p className="font-display text-2xl text-ink">Sentiment trending up</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-display text-violet font-semibold">+12%</p>
              <p className="text-xs text-ink-soft">vs last week</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Reviews analyzed", value: "284" },
              { label: "Issues resolved", value: "9" },
              { label: "New opportunity", value: "1" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/40 rounded-xl p-4 border border-white/60">
                <p className="text-2xl font-display text-ink font-semibold">{stat.value}</p>
                <p className="text-xs text-ink-soft mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-gradient-to-r from-violet-soft/60 to-peach-soft/60 p-4 border border-white/60">
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">AI Suggestion: </span>
              Guests love the rooftop breakfast, consider featuring it in your listing photos.
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}