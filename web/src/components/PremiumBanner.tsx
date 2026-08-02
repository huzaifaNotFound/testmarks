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
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card p-6 sm:p-8"
      >
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="chip-warning">
              <Sparkles size={11} /> Premium member
            </span>
            <h3 className="heading mt-3 text-lg sm:text-xl font-bold">Unlimited tests unlocked</h3>
            <p className="mt-1 max-w-md text-xs sm:text-sm text-black/50 dark:text-white/50">
              Full analytics, personal AI coach and unlimited mock tests are active on your account.
            </p>
          </div>
          <span className="chip-success self-start sm:self-auto">
            <Check size={13} /> Premium active
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card border-crimson/25 bg-crimson-soft/30 p-6 sm:p-8 dark:bg-crimson/5"
    >
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-3">
          <span className="chip-crimson">
            <Sparkles size={11} /> Free tier
          </span>
          <h3 className="heading text-lg sm:text-xl font-bold">
            {remaining > 0 ? `${remaining} free test${remaining > 1 ? "s" : ""} left today` : "Daily limit reached"}
          </h3>
          <p className="max-w-md text-xs sm:text-sm text-black/50 dark:text-white/50">
            {remaining > 0
              ? "Upgrade to Premium for unlimited AI mock tests, full analytics and a personal AI coach."
              : "Your free quota is done — go Premium for unlimited tests and never stop practicing."}
          </p>
          <div className="pt-1 max-w-xs">
            <Progress value={dailyUsed} max={dailyLimit} variant="default" size="sm" />
          </div>
        </div>
        <Link
          href="/premium"
          className="btn-primary self-start sm:self-auto"
        >
          <Sparkles size={14} /> Go Premium
        </Link>
      </div>
    </motion.div>
  );
}
