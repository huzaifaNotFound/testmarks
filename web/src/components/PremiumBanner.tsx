"use client";

import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Progress } from "@/components/ui";

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
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-white/[0.02] shadow-sm sm:p-8"
      >
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Sparkles size={11} /> Premium member
            </span>
            <h3 className="heading mt-3 text-xl sm:text-2xl font-bold">Unlimited tests unlocked</h3>
            <p className="mt-1 max-w-md text-sm text-black/60 dark:text-white/60">
              Full analytics, personal AI coach and unlimited mock tests are active on your account.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-black/5 bg-black/[0.02] px-6 py-2.5 text-sm font-semibold text-black/80 dark:border-white/10 dark:bg-white/5 dark:text-white/90">
            <Check size={15} /> Premium active
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl border border-crimson/20 bg-crimson-soft/30 p-6 dark:bg-crimson/5 shadow-sm sm:p-8"
    >
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-crimson">
            <Sparkles size={11} /> Free tier
          </span>
          <h3 className="heading text-xl sm:text-2xl font-bold">
            {remaining > 0 ? `${remaining} free test${remaining > 1 ? "s" : ""} left today` : "Daily limit reached"}
          </h3>
          <p className="max-w-md text-sm text-black/60 dark:text-white/60">
            {remaining > 0
              ? "Upgrade to Premium for unlimited AI mock tests, full analytics and a personal AI coach."
              : "Your free quota is done — go Premium for unlimited tests and never stop practicing."}
          </p>
          <div className="pt-1 max-w-sm">
            <Progress value={dailyUsed} max={dailyLimit} variant="default" size="sm" />
          </div>
        </div>
        <Link
          href="/premium"
          className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-sm"
        >
          <Sparkles size={15} /> Go Premium
        </Link>
      </div>
    </motion.div>
  );
}
