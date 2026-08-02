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
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay }}
      className={`card flex flex-col items-center gap-2 p-4 text-center ${
        earned ? "" : "opacity-45 grayscale"
      }`}
    >
      <span
        className={`inline-flex h-12 w-12 items-center justify-center rounded-lgx ${
          earned ? "bg-crimson text-white shadow-1" : "bg-black/10 text-black/40 dark:bg-white/10 dark:text-white/40"
        }`}
      >
        <Icon size={22} />
      </span>
      <div className="heading text-sm">{name}</div>
      <div className="text-[11px] leading-snug text-black/50 dark:text-white/50">{description}</div>
      {!earned && <span className="label mt-auto">Locked</span>}
    </motion.div>
  );
}
