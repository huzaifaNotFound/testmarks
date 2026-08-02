"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Target,
  Timer as TimerIcon,
  Percent,
  Brain,
  TrendingUp,
  ListChecks,
  ArrowRight,
  Bot,
  Loader2,
} from "lucide-react";
import ScoreRing from "@/components/ScoreRing";
import Confetti from "@/components/Confetti";
import Typewriter from "@/components/Typewriter";
import { getPlan } from "@/lib/api";
import { RequireAuth, useAuth } from "@/lib/auth";
import { formatTime, cn } from "@/lib/utils";
import { readResult } from "@/lib/result-store";
import type { PlanRecommendation } from "@/lib/types";

const ACCENT_GREEN = "#16A34A";

export default function ReportPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanRecommendation[] | null>(null);
  const [confetti, setConfetti] = useState(false);

  const stored = readResult();

  useEffect(() => {
    if (!stored) {
      router.replace("/dashboard");
      return;
    }
    if (stored.result.accuracy >= 0.6) {
      const t = setTimeout(() => setConfetti(true), 600);
      return () => clearTimeout(t);
    }
  }, [stored, router]);

  useEffect(() => {
    if (!stored || !user) return;
    getPlan(user.id, stored.test.test_id).then(setPlan);
  }, [stored, user]);

  if (!stored) return null;

  const { result, timeTakenSec } = stored;
  const maxBar = Math.max(...result.per_topic.map((t) => t.total), 1);

  return (
    <RequireAuth>
      <div className="relative min-h-screen">
      <Confetti active={confetti} />

      <div className="container-px max-w-5xl py-8 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <span className="chip border-crimson/30 bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light">
            <Bot size={13} /> AI coach report
          </span>
          <h1 className="heading mt-4 text-3xl sm:text-5xl">{stored.test.title}</h1>
          <p className="mt-2 text-sm text-black/50 dark:text-white/50">
            Graded topic-by-topic · {Math.round(result.percentile_est)}th percentile estimate
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[280px_1fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="card flex flex-col items-center justify-center gap-6 p-7"
          >
            <ScoreRing score={result.score} total={result.total} />
            <div className="grid w-full grid-cols-2 gap-3">
              <div className="rounded-lgx bg-black/[0.04] p-3.5 text-center dark:bg-white/5">
                <Percent size={15} className="mx-auto text-crimson" />
                <div className="heading mt-1.5 text-xl">{Math.round(result.accuracy * 100)}%</div>
                <div className="label">Accuracy</div>
              </div>
              <div className="rounded-lgx bg-black/[0.04] p-3.5 text-center dark:bg-white/5">
                <TimerIcon size={15} className="mx-auto text-crimson" />
                <div className="heading mt-1.5 text-xl">{formatTime(timeTakenSec)}</div>
                <div className="label">Time taken</div>
              </div>
              <div className="col-span-2 rounded-lgx bg-black/[0.04] p-3.5 text-center dark:bg-white/5">
                <TrendingUp size={15} className="mx-auto text-crimson" />
                <div className="heading mt-1.5 text-xl">{result.percentile_est}th</div>
                <div className="label">Estimated percentile</div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="card p-6"
            >
              <h2 className="heading mb-4 flex items-center gap-2 text-lg">
                <ListChecks size={18} className="text-crimson" /> Topic breakdown
              </h2>
              <div className="space-y-3.5">
                {result.per_topic.map((t) => (
                  <div key={`${t.subject}-${t.topic}`}>
                    <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                      <span className="font-semibold">
                        {t.topic}
                        <span className="ml-2 font-normal text-black/40 dark:text-white/40">{t.subject}</span>
                      </span>
                      <span className="font-bold tabular-nums">
                        {t.correct}/{t.total}
                        <span className={cn("ml-2 font-semibold", t.accuracy >= 0.6 ? "text-emerald-600 dark:text-emerald-400" : "text-crimson")}>
                          {Math.round(t.accuracy * 100)}%
                        </span>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-pill bg-black/[0.06] dark:bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(t.total / maxBar) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.35 }}
                        className="h-full rounded-pill bg-gradient-to-r from-crimson to-crimson-light"
                      />
                      <div className="relative -mt-2 h-2">
                        <motion.div
                          initial={{ left: 0 }}
                          animate={{ left: `${t.accuracy * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                          className="absolute top-0 h-2 w-1.5 rounded-pill bg-ink dark:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card border-crimson/20 p-5"
              >
                <h3 className="heading flex items-center gap-2 text-sm uppercase tracking-wide text-crimson">
                  <Brain size={15} /> Weak areas
                </h3>
                <div className="mt-3 space-y-2">
                  {result.weak_areas.length === 0 && <p className="text-xs text-black/45 dark:text-white/45">No weak areas detected — beast mode.</p>}
                  {result.weak_areas.map((w) => (
                    <div key={w.topic} className="flex items-center justify-between rounded-lgx bg-crimson-soft px-3 py-2 text-xs font-semibold text-crimson dark:bg-crimson/15 dark:text-crimson-light">
                      {w.topic}
                      <span className="tabular-nums">{Math.round(w.accuracy * 100)}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card border-emerald-500/20 p-5"
              >
                <h3 className="heading flex items-center gap-2 text-sm uppercase tracking-wide" style={{ color: ACCENT_GREEN }}>
                  <Target size={15} /> Strong areas
                </h3>
                <div className="mt-3 space-y-2">
                  {result.strong_areas.length === 0 && <p className="text-xs text-black/45 dark:text-white/45">Keep practising — strong areas will show up here.</p>}
                  {result.strong_areas.map((w) => (
                    <div key={w.topic} className="flex items-center justify-between rounded-lgx bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {w.topic}
                      <span className="tabular-nums">{Math.round(w.accuracy * 100)}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card relative mt-5 overflow-hidden bg-ink !text-white"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-crimson opacity-30 blur-[80px]" />
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lgx bg-crimson text-white shadow-glow">
                <Bot size={19} />
              </span>
              <div>
                <div className="heading text-sm">Your AI coach</div>
                <div className="text-[11px] text-white/50">Reads your mistakes · writes your plan</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
              <Typewriter text={result.coach_message} />
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card mt-5 p-6"
        >
          <h2 className="heading mb-1 flex items-center gap-2 text-lg">
            <TrendingUp size={18} className="text-crimson" /> Your 7-day focus plan
          </h2>
          <p className="text-xs text-black/45 dark:text-white/45">Generated from the weak areas in this test</p>
          <div className="mt-4 space-y-3">
            {plan === null && (
              <div className="flex items-center gap-2 text-sm text-black/45 dark:text-white/45">
                <Loader2 size={15} className="animate-spin text-crimson" /> Planning your focus tests…
              </div>
            )}
            {plan?.map((p, i) => (
              <motion.div
                key={p.topic}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i }}
                className="rounded-lgx border border-black/10 p-4 dark:border-white/10"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip border-crimson/30 bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light">
                    Day {i + 1}
                  </span>
                  <span className="heading text-sm">{p.topic}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-black/55 dark:text-white/55">{p.advice}</p>
                <p className="mt-1.5 text-[11px] font-medium text-black/40 dark:text-white/40">{p.reason}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <button onClick={() => router.push("/dashboard")} className="btn-primary px-8 py-4">
            Go to Dashboard <ArrowRight size={17} />
          </button>
        </div>
      </div>
      </div>
    </RequireAuth>
  );
}
