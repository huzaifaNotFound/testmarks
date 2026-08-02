"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Badge({
  name,
  description,
  icon: Icon,
  earned,
  delay = 0,
}: {
  name: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className={`card flex flex-col items-center gap-2.5 p-4.5 text-center ${
        earned ? "" : "opacity-40 grayscale"
      }`}
    >
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${
          earned
            ? "border-crimson/20 bg-crimson-soft text-crimson"
            : "border-black/[0.06] bg-black/[0.02] text-black/35 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-white/35"
        }`}
      >
        <Icon size={18} />
      </span>
      <div>
        <div className="heading text-[13px] font-bold text-ink dark:text-white">{name}</div>
        <div className="mt-1 text-[10.5px] leading-snug text-black/45 dark:text-white/45">{description}</div>
      </div>
      {!earned && <span className="label mt-auto text-[9px] tracking-[0.1em]">Locked</span>}
    </motion.div>
  );
}
