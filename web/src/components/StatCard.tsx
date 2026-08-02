import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import CountUp from "./CountUp";

export default function StatCard({
  label,
  value,
  decimals = 0,
  suffix = "",
  icon: Icon,
  accent = "#3D3580",
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
        className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(100,80,50,0.12)] bg-[rgba(100,80,50,0.03)] dark:border-white/[0.06] dark:bg-white/[0.02]"
        style={{ color: accent }}
      >
        <Icon size={16} />
      </div>
      <div className="heading text-2xl sm:text-3xl font-bold text-ink dark:text-white">
        <CountUp value={value} decimals={decimals} suffix={suffix} />
      </div>
      <div className="label mt-1">{label}</div>
      {sub && <div className="mt-1.5 text-[11px] text-ink/45 dark:text-white/45">{sub}</div>}
    </motion.div>
  );
}
