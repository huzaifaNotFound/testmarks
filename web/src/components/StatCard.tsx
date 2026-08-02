import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import CountUp from "./CountUp";

export default function StatCard({
  label,
  value,
  decimals = 0,
  suffix = "",
  icon: Icon,
  accent = "#DC143C",
  sub,
  delay = 0,
}: {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  icon: LucideIcon;
  accent?: string;
  sub?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay }}
      className="card p-5 sm:p-6"
    >
      <div
        className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.06] bg-black/[0.02] dark:border-white/[0.06] dark:bg-white/[0.02]"
        style={{ color: accent }}
      >
        <Icon size={16} />
      </div>
      <div className="heading text-2xl sm:text-3xl font-extrabold text-ink dark:text-white">
        <CountUp value={value} decimals={decimals} suffix={suffix} />
      </div>
      <div className="label mt-1">{label}</div>
      {sub && <div className="mt-1.5 text-[11px] text-black/45 dark:text-white/45">{sub}</div>}
    </motion.div>
  );
}
