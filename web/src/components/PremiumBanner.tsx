"use client";

import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";

export default function PremiumBanner({
  dailyUsed = 1,
  dailyLimit = 2,
}: {
  dailyUsed?: number;
  dailyLimit?: number;
}) {
  const { user } = useAuth();
  const isPremium = user?.premium ?? false;
  const remaining = Math.max(0, dailyLimit - dailyUsed);

  if (isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-card bg-gradient-to-r from-amber-400 to-crimson p-6 text-white shadow-glow-lg sm:p-8"
      >
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
              <Sparkles size={12} /> Premium member
            </span>
            <h3 className="heading mt-3 text-xl sm:text-2xl">Unlimited tests unlocked</h3>
            <p className="mt-1 max-w-md text-sm text-white/80">
              Full analytics, personal AI coach and unlimited mock tests are active on your account.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-pill bg-white px-6 py-3 text-sm font-bold text-crimson-deep">
            <Check size={16} /> Premium active
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-card bg-gradient-to-r from-crimson to-crimson-deep p-6 text-white shadow-glow-lg sm:p-8"
    >
      <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 right-24 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
            <Sparkles size={12} /> Free plan
          </span>
          <h3 className="heading mt-3 text-xl sm:text-2xl">
            {remaining > 0 ? `${remaining} free test${remaining > 1 ? "s" : ""} left today` : "Daily limit reached"}
          </h3>
          <p className="mt-1 max-w-md text-sm text-white/80">
            {remaining > 0
              ? "Upgrade to Premium for unlimited AI mock tests, full analytics and a personal AI coach."
              : "Your free quota is done — go Premium for unlimited tests and never stop practicing."}
          </p>
          <div className="mt-3 h-2 w-full max-w-sm overflow-hidden rounded-pill bg-white/20">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(100, (dailyUsed / dailyLimit) * 100)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-pill bg-white"
            />
          </div>
        </div>
        <Link
          href="/premium"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-pill bg-white px-6 py-3 text-sm font-bold text-crimson-deep transition-transform hover:scale-105 active:scale-95"
        >
          <Sparkles size={16} /> Go Premium
        </Link>
      </div>
    </motion.div>
  );
}
