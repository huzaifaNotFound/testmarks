"use client";

import { motion } from "framer-motion";
import CountUp from "./CountUp";

export default function ScoreRing({
  score,
  total,
  size = 200,
  label = "Score",
}: {
  score: number;
  total: number;
  size?: number;
  label?: string;
}) {
  const pct = total > 0 ? score / total : 0;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Semantic color mapping aligned to tokens
  const color =
    pct >= 0.8
      ? "#16A34A" // Success green
      : pct >= 0.6
        ? "#DC143C" // Crimson
        : pct >= 0.4
          ? "#F59E0B" // Warning amber
          : "#EF4444"; // Danger red

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-black/[0.04] dark:text-white/5"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - pct) }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="heading text-4xl sm:text-5xl tracking-tight">
          <CountUp value={score} suffix={`/${total}`} />
        </div>
        <div className="label mt-1.5 text-black/45 dark:text-white/40">{label}</div>
        <div className="mt-0.5 text-xs font-bold" style={{ color }}>
          {Math.round(pct * 100)}% Accuracy
        </div>
      </div>
    </div>
  );
}
