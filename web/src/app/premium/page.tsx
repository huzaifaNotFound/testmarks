"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Sparkles,
  Bot,
  CreditCard,
  Loader2,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import { PageHeader } from "@/components/ui";
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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div className="text-center space-y-3">
            <span className="chip mx-auto border-crimson/25 bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light">
              <Sparkles size={12} /> Pricing plans
            </span>
            <h1 className="heading text-3xl sm:text-5xl font-extrabold tracking-tight">
              Train without limits
            </h1>
            <p className="mx-auto max-w-md text-sm text-black/55 dark:text-white/55">
              {isPremium
                ? "You have active Premium access. Good luck on the prep."
                : "Unlock full diagnostics, personalized focus tests, and continuous AI tutoring."}
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            <div className="card p-7 bg-white dark:bg-white/[0.01] border-black/5 dark:border-white/10 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <h3 className="heading text-lg font-bold">Free Plan</h3>
                  <div className="heading mt-2 text-4xl font-extrabold">
                    ₹0 <span className="text-sm font-medium text-black/45 dark:text-white/45">/ forever</span>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-black/60 dark:text-white/60">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check size={14} className="shrink-0 text-success" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {!isPremium && (
                <div className="mt-6 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 px-4 py-3 text-xs text-black/50 dark:text-white/40 font-medium">
                  Current plan active. Daily limit reset in 12h.
                </div>
              )}
            </div>

            <div className="card p-7 bg-white dark:bg-white/[0.01] border-crimson/20 dark:border-crimson/30 flex flex-col justify-between shadow-sm relative ring-1 ring-crimson/10">
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="heading text-lg font-bold text-crimson">Premium access</h3>
                    <div className="heading mt-2 text-4xl font-extrabold">
                      ₹499 <span className="text-sm font-medium text-black/45 dark:text-white/45">/ month</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-crimson/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-crimson">
                    <Sparkles size={10} /> RECOMMENDED
                  </span>
                </div>
                <ul className="space-y-3 text-sm text-black/70 dark:text-white/70">
                  {PREMIUM_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check size={14} className="shrink-0 text-crimson" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={handleUpgrade}
                disabled={isPremium}
                className={cn(
                  "w-full mt-6 py-3 px-4 rounded-full text-sm font-bold transition-all focus-visible:ring-2",
                  isPremium
                    ? "bg-black/[0.02] text-black/40 border border-black/5 dark:bg-white/5 dark:text-white/30 cursor-not-allowed"
                    : "bg-crimson text-white hover:bg-crimson-deep"
                )}
              >
                {isPremium ? (
                  <span className="flex items-center justify-center gap-1.5"><Check size={14} /> Active membership</span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5"><CreditCard size={14} /> Upgrade Now</span>
                )}
              </button>
            </div>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="card overflow-hidden p-0 border border-black/5 dark:border-white/10">
              <div className="border-b border-black/5 p-5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
                <h3 className="heading text-base font-bold">Feature comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-black/45 dark:text-white/40">
                      <th className="px-6 py-3 font-semibold">Feature</th>
                      <th className="px-6 py-3 text-center font-semibold">Free</th>
                      <th className="px-6 py-3 text-center font-semibold text-crimson">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row, i) => (
                      <tr key={row.feature} className={cn("border-t border-black/5 dark:border-white/5", i % 2 === 1 && "bg-black/[0.01] dark:bg-white/[0.01]")}>
                        <td className="px-6 py-3.5 font-medium">{row.feature}</td>
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

        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.96, y: 8 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 8 }}
                className="card w-full max-w-md p-6 text-center bg-white dark:bg-ink border border-black/5 dark:border-white/10"
              >
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-black/45 hover:text-crimson dark:text-white/45 focus-visible:ring-2"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-crimson/10 text-crimson">
                  <CreditCard size={20} />
                </span>
                <h3 className="heading mt-4 text-lg font-bold">Simulate membership</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/55 dark:text-white/55">
                  Confirm your diagnostic subscription logic bypass. This activates premium status for this account storage context.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                  <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">
                    Cancel
                  </button>
                  <button onClick={simulateUpgrade} disabled={processing} className="btn-primary flex-1">
                    {processing ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
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
