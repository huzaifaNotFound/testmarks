"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Check,
  X,
  Sparkles,
  Bot,
  CreditCard,
  Loader2,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import { RequireAuth, useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const PAYMENT_API_KEY = process.env.NEXT_PUBLIC_PAYMENT_API_KEY;

const FREE_FEATURES = [
  "2 mock tests per day",
  "Diagnostic test + AI report",
  "Basic dashboard analytics",
  "Community leaderboard",
  "Streaks & XP",
];

const PREMIUM_FEATURES = [
  "Unlimited AI mock tests",
  "Personal AI coach + study plan",
  "Full analytics + score predictor",
  "Focus tests on weak topics",
  "Mastery heatmaps (all topics)",
  "Early access to new features",
];

const COMPARISON = [
  { feature: "Mock tests per day", free: "2", premium: "Unlimited" },
  { feature: "AI coach messages", free: "Basic", premium: "Personalised" },
  { feature: "Topic-wise analytics", free: "Core subjects", premium: "All + heatmap" },
  { feature: "Score predictor", free: "—", premium: "Yes" },
  { feature: "Focus tests", free: "—", premium: "Unlimited" },
  { feature: "Badges & streaks", free: "Yes", premium: "Yes" },
];

export default function PremiumPage() {
  const { user, updateUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const isPremium = user?.premium ?? false;

  const handleUpgrade = () => {
    setModalOpen(true);
  };

  const simulateUpgrade = () => {
    setProcessing(true);
    setTimeout(() => {
      updateUser({ premium: true });
      setProcessing(false);
      setModalOpen(false);
    }, 1400);
  };

  return (
    <RequireAuth>
      <AppShell>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          {/* Header section with illustrations */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4 text-left">
              <span className="chip-crimson">
                <Sparkles size={11} /> Pricing plans
              </span>
              <h1 className="heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                Train without limits
              </h1>
              <p className="max-w-md text-xs sm:text-sm text-black/50 dark:text-white/50 leading-relaxed">
                {isPremium
                  ? "You have active Premium access. Good luck on the prep."
                  : "Unlock full diagnostics, personalized focus tests, and continuous AI tutoring."}
              </p>
            </div>
            
            {/* Voxel illustration banner */}
            <div className="relative overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-2 dark:border-white/[0.06] dark:bg-white/[0.02] aspect-[21/9] w-full">
              <Image
                src="/illustrations/premium.png"
                alt="Grand Library illustration"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Pricing cards */}
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="card p-7 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <h3 className="heading text-[14px] font-bold text-ink/75 dark:text-white/75">Free Plan</h3>
                  <div className="heading mt-2 text-3xl font-extrabold text-ink dark:text-white">
                    ₹0 <span className="text-sm font-normal text-black/40 dark:text-white/40">/ forever</span>
                  </div>
                </div>
                <ul className="space-y-3 text-[13px] text-black/60 dark:text-white/60">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check size={13} className="shrink-0 text-success" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {!isPremium && (
                <div className="mt-6 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] px-3.5 py-2.5 text-xs text-black/50 dark:text-white/40 font-medium">
                  Current plan active. Daily limit resets at midnight.
                </div>
              )}
            </div>

            <div className="relative flex flex-col justify-between overflow-hidden rounded-card border border-crimson/25 bg-white p-7 shadow-2 dark:bg-[#141416]">
              {/* Top crimson line */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-crimson" />
              
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="heading text-[14px] font-bold text-crimson">Premium Access</h3>
                    <div className="heading mt-2 text-3xl font-extrabold text-ink dark:text-white">
                      ₹499 <span className="text-sm font-normal text-black/40 dark:text-white/40">/ month</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-crimson/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-crimson">
                    <Sparkles size={9} /> Recommended
                  </span>
                </div>
                <ul className="space-y-3 text-[13px] text-black/65 dark:text-white/65">
                  {PREMIUM_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check size={13} className="shrink-0 text-crimson" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={handleUpgrade}
                disabled={isPremium}
                className={cn(
                  "w-full mt-6 btn-primary focus-visible:ring-2",
                  isPremium && "bg-black/[0.02] text-black/40 border border-black/5 dark:bg-white/5 dark:text-white/30 cursor-not-allowed hover:bg-black/[0.02]"
                )}
              >
                {isPremium ? (
                  <span className="flex items-center justify-center gap-1.5"><Check size={13} /> Active membership</span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5"><CreditCard size={13} /> Upgrade Now</span>
                )}
              </button>
            </div>
          </div>

          {/* Comparison table */}
          <div className="mx-auto max-w-4xl">
            <div className="card overflow-hidden border border-black/[0.07] dark:border-white/[0.07]">
              <div className="border-b border-black/[0.06] p-5 dark:border-white/[0.06] bg-black/[0.01] dark:bg-white/[0.01]">
                <h3 className="heading text-[14px] font-bold text-ink dark:text-white">Feature comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-[13px]">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-black/40 dark:text-white/40 border-b border-black/[0.06] dark:border-white/[0.06]">
                      <th className="px-6 py-3 font-semibold">Feature</th>
                      <th className="px-6 py-3 text-center font-semibold">Free</th>
                      <th className="px-6 py-3 text-center font-semibold text-crimson">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row, i) => (
                      <tr key={row.feature} className={cn("border-b border-black/[0.05] dark:border-white/[0.05] last:border-0", i % 2 === 1 && "bg-black/[0.01] dark:bg-white/[0.01]")}>
                        <td className="px-6 py-3.5 font-medium text-ink/80 dark:text-white/80">{row.feature}</td>
                        <td className="px-6 py-3.5 text-center text-black/50 dark:text-white/50">{row.free}</td>
                        <td className="px-6 py-3.5 text-center font-bold text-crimson dark:text-crimson-light">{row.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-4xl rounded-lg border border-dashed border-black/10 p-4 text-center text-xs text-black/45 dark:border-white/10 dark:text-white/40">
            <div className="mb-1 flex items-center justify-center gap-1.5 font-bold text-black/60 dark:text-white/50">
              <Bot size={13} /> Payment Connector stub
            </div>
            {PAYMENT_API_KEY ? (
              <span>Configured client key. Real gateway active in production.</span>
            ) : (
              <span>
                Simulated Sandbox Mode. Real payment methods are decoupled.
              </span>
            )}
          </div>
        </motion.div>

        {/* Modal dialog */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.96, y: 8 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 8 }}
                className="card w-full max-w-md p-6 text-center bg-white dark:bg-[#1A1A1E] relative border border-black/[0.07] dark:border-white/[0.07] shadow-3"
              >
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-black/40 hover:bg-black/[0.05] dark:text-white/40 dark:hover:bg-white/[0.05]"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
                <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-lg border border-black/[0.06] bg-black/[0.02] text-crimson dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <CreditCard size={18} />
                </span>
                <h3 className="heading mt-4 text-base font-bold text-ink dark:text-white">Simulate membership</h3>
                <p className="mt-2 text-xs leading-relaxed text-black/50 dark:text-white/50">
                  Confirm your diagnostic subscription logic bypass. This activates premium status for this account storage context.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-2">
                  <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">
                    Cancel
                  </button>
                  <button onClick={simulateUpgrade} disabled={processing} className="btn-primary flex-1">
                    {processing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    Activate Premium
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AppShell>
    </RequireAuth>
  );
}
