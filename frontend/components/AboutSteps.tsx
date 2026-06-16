"use client";
import { motion } from "motion/react";
import GlassCard from "./GlassCard";

const steps = [
  {
    number: "01",
    title: "Reviews come in",
    description: "Every new guest review and photo is captured automatically from your listing channels.",
  },
  {
    number: "02",
    title: "Gevora reads it",
    description: "Gemini analyzes sentiment, tone, and images — spotting issues, praise, and patterns a quick skim would miss.",
  },
  {
    number: "03",
    title: "You get the summary",
    description: "Tickets are drafted, trends are charted, and a plain-language report lands in your dashboard.",
  },
];

export default function AboutSteps() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl md:text-3xl font-medium text-ink mb-6">
        How it works
      </h2>

      {steps.map((step, i) => (
        <motion.div
          key={step.number}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
          style={{ perspective: 1000 }}
        >
          <GlassCard className="p-6 flex items-start gap-5">
            <span className="font-display text-3xl text-violet-soft font-semibold shrink-0">
              {step.number}
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-ink mb-1">
                {step.title}
              </h3>
              <p className="text-ink-soft text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}