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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay }}
      className="card p-5 sm:p-6"
    >
      <div
        className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lgx text-white"
        style={{ background: accent }}
      >
        <Icon size={20} />
      </div>
      <div className="heading text-3xl sm:text-4xl">
        <CountUp value={value} decimals={decimals} suffix={suffix} />
      </div>
      <div className="label mt-1">{label}</div>
      {sub && <div className="mt-2 text-xs text-black/50 dark:text-white/50">{sub}</div>}
    </motion.div>
  );
}
