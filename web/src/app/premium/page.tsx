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
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center">
          <span className="chip mx-auto border-crimson/30 bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light">
            <Sparkles size={13} /> Premium
          </span>
          <h1 className="heading mx-auto mt-4 max-w-xl text-3xl sm:text-5xl">
            Train without limits
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-black/55 dark:text-white/55">
            {isPremium
              ? "You are a Premium member. Thanks for believing in the grind."
              : "Free is for trying. Premium is for topping the rank list."}
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card p-7"
          >
            <h3 className="heading text-lg">Free</h3>
            <div className="heading mt-2 text-4xl">
              ₹0 <span className="text-sm font-medium text-black/45 dark:text-white/45">/ forever</span>
            </div>
            <ul className="mt-5 space-y-2.5">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-black/65 dark:text-white/65">
                  <Check size={15} className="mt-0.5 shrink-0 text-emerald-500" /> {f}
                </li>
              ))}
            </ul>
            {!isPremium && (
              <div className="mt-6 rounded-lgx bg-black/[0.04] px-4 py-3 text-xs font-semibold text-black/55 dark:bg-white/5 dark:text-white/55">
                Current plan — {2 - 1} of 2 tests left today
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="relative overflow-hidden rounded-card bg-gradient-to-br from-crimson to-crimson-deep p-7 text-white shadow-glow-lg"
          >
            <div className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
            <span className="inline-flex items-center gap-1 rounded-pill bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles size={11} /> Recommended
            </span>
            <h3 className="heading mt-3 text-lg">Premium</h3>
            <div className="heading mt-2 text-4xl">
              ₹499 <span className="text-sm font-medium text-white/60">/ month</span>
            </div>
            <ul className="mt-5 space-y-2.5">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/85">
                  <Check size={15} className="mt-0.5 shrink-0 text-white" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={isPremium}
              className="btn mt-6 w-full bg-white text-crimson-deep hover:bg-white/90 disabled:opacity-70"
            >
              {isPremium ? (
                <>
                  <Check size={16} /> Active
                </>
              ) : (
                <>
                  <CreditCard size={16} /> Upgrade to Premium
                </>
              )}
            </button>
          </motion.div>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card overflow-hidden p-0">
            <div className="border-b border-black/5 p-6 dark:border-white/10">
              <h3 className="heading text-lg">Feature comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-black/45 dark:text-white/45">
                    <th className="px-6 py-3 font-semibold">Feature</th>
                    <th className="px-6 py-3 text-center font-semibold">Free</th>
                    <th className="bg-crimson/5 px-6 py-3 text-center font-semibold text-crimson dark:bg-crimson/10">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.feature} className={cn("border-t border-black/5 dark:border-white/10", i % 2 === 1 && "bg-black/[0.02] dark:bg-white/[0.02]")}>
                      <td className="px-6 py-3.5 font-medium">{row.feature}</td>
                      <td className="px-6 py-3.5 text-center text-black/50 dark:text-white/50">{row.free}</td>
                      <td className="bg-crimson/5 px-6 py-3.5 text-center font-bold text-crimson dark:bg-crimson/10 dark:text-crimson-light">{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto mt-6 max-w-4xl rounded-lgx border border-dashed border-black/15 p-4 text-center text-xs text-black/45 dark:border-white/15 dark:text-white/45">
          <div className="mb-1 flex items-center justify-center gap-1.5 font-bold text-black/60 dark:text-white/60">
            <Bot size={13} /> PaymentConnector
          </div>
          {PAYMENT_API_KEY ? (
            <>Payment connector configured with NEXT_PUBLIC_PAYMENT_API_KEY (env).</>
          ) : (
            <>
              Set <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[11px] dark:bg-white/10">NEXT_PUBLIC_PAYMENT_API_KEY</code>{" "}
              in <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[11px] dark:bg-white/10">.env.local</code> to wire the real gateway.
            </>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.94, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 14 }}
              className="card w-full max-w-md p-7 text-center"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lgx text-black/45 hover:text-crimson dark:text-white/45"
                aria-label="Close"
              >
                <X size={16} />
              </button>
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-card bg-crimson text-white shadow-glow">
                <CreditCard size={24} />
              </span>
              <h3 className="heading mt-4 text-xl">Payment gateway coming soon</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/55 dark:text-white/55">
                Payments are not wired up yet. Premium will be activated right here in the app
                once a payment gateway is connected via{" "}
                <code className="rounded bg-black/5 px-1 py-0.5 font-mono text-xs dark:bg-white/10">NEXT_PUBLIC_PAYMENT_API_KEY</code>.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <button onClick={() => setModalOpen(false)} className="btn-ghost">
                  Maybe later
                </button>
                <button onClick={simulateUpgrade} disabled={processing} className="btn-primary">
                  {processing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Activate premium (stub)
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
