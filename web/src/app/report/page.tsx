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
import { formatTime, cn, normalizeMastery, formatMasteryPercent } from "@/lib/utils";
import { readResult } from "@/lib/result-store";
import type { PlanRecommendation } from "@/lib/types";

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
    if (normalizeMastery(stored.result.accuracy) >= 0.6) {
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
      <div className="relative min-h-screen bg-surface dark:bg-[#101114]">
        <Confetti active={confetti} />

        <div className="container-px max-w-5xl py-10 sm:py-16 space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center space-y-3"
          >
            <span className="chip-primary">
              <Bot size={13} /> AI evaluation complete
            </span>
            <h1 className="heading text-2xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-white" style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}>
              {stored.test.title}
            </h1>
            <p className="text-xs sm:text-sm text-ink/50 dark:text-white/45 font-medium">
              Subject mastery evaluation · {Math.round(result.percentile_est)}th percentile estimate
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 }}
              className="card flex flex-col items-center justify-center gap-6 p-6"
            >
              <ScoreRing score={result.score} total={result.total} />
              <div className="grid w-full grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-[rgba(100,80,50,0.12)] bg-[rgba(100,80,50,0.02)] p-3 text-center dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <Percent size={14} className="mx-auto text-primary dark:text-primary-light" />
                  <div className="heading mt-1.5 text-base font-bold text-ink dark:text-white">
                    {formatMasteryPercent(result.accuracy)}%
                  </div>
                  <div className="label text-[9px]">Accuracy</div>
                </div>
                <div className="rounded-lg border border-[rgba(100,80,50,0.12)] bg-[rgba(100,80,50,0.02)] p-3 text-center dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <TimerIcon size={14} className="mx-auto text-primary dark:text-primary-light" />
                  <div className="heading mt-1.5 text-base font-bold text-ink dark:text-white">
                    {formatTime(timeTakenSec)}
                  </div>
                  <div className="label text-[9px]">Time taken</div>
                </div>
                <div className="col-span-2 rounded-lg border border-[rgba(100,80,50,0.12)] bg-[rgba(100,80,50,0.02)] p-3 text-center dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <TrendingUp size={14} className="mx-auto text-primary dark:text-primary-light" />
                  <div className="heading mt-1.5 text-base font-bold text-ink dark:text-white">
                    {result.percentile_est}th
                  </div>
                  <div className="label text-[9px]">Estimated Percentile</div>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="card p-6"
              >
                <h2 className="heading mb-5 flex items-center gap-2 text-sm sm:text-base font-bold text-ink dark:text-white">
                  <ListChecks size={15} className="text-primary dark:text-primary-light" /> Topic breakdown
                </h2>
                <div className="space-y-4">
                  {result.per_topic.map((t) => (
                    <div key={`${t.subject}-${t.topic}`} className="space-y-1">
                      <div className="flex items-baseline justify-between gap-2 text-[12.5px]">
                        <span className="font-semibold text-ink/80 dark:text-white/80">
                          {t.topic}
                          <span className="ml-2 text-xs font-normal text-ink/40 dark:text-white/40">{t.subject}</span>
                        </span>
                        <span className="font-bold tabular-nums text-ink dark:text-white">
                          {t.correct}/{t.total}
                          <span className={cn("ml-2 font-semibold", normalizeMastery(t.accuracy) >= 0.6 ? "text-forest" : "text-danger")}>
                            {formatMasteryPercent(t.accuracy)}%
                          </span>
                        </span>
                      </div>
                      <div className="progress">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(t.total / maxBar) * 100}%` }}
                          transition={{ duration: 0.6, delay: 0.15 }}
                          className="progress-bar bg-primary/70"
                        />
                        <div className="relative -mt-1.5 h-1.5">
                          <motion.div
                            initial={{ left: 0 }}
                            animate={{ left: `${normalizeMastery(t.accuracy) * 100}%` }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                            className="absolute top-0 h-1.5 w-1 rounded-full bg-ink dark:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  className="card border-primary/10 p-5"
                >
                  <h3 className="heading flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-primary dark:text-primary-light font-bold">
                    <Brain size={13} /> Weak areas
                  </h3>
                  <div className="mt-3 space-y-2">
                    {result.weak_areas.length === 0 && (
                      <p className="text-xs text-ink/40 dark:text-white/40">No weak areas detected. Outstanding performance.</p>
                    )}
                    {result.weak_areas.map((w) => (
                      <div
                        key={w.topic}
                        className="flex items-center justify-between gap-2 rounded-lg bg-primary-soft/50 border border-primary/10 px-3 py-2 text-xs font-semibold text-primary dark:bg-primary/10 dark:text-primary-light"
                      >
                        <span className="truncate">{w.topic}</span>
                        <span className="tabular-nums shrink-0">{formatMasteryPercent(w.accuracy)}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card border-forest/10 p-5"
                >
                  <h3 className="heading flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-forest font-bold">
                    <Target size={13} /> Strong areas
                  </h3>
                  <div className="mt-3 space-y-2">
                    {result.strong_areas.length === 0 && (
                      <p className="text-xs text-ink/45 dark:text-white/45">Practice more to record mastery milestones here.</p>
                    )}
                    {result.strong_areas.map((w) => (
                      <div
                        key={w.topic}
                        className="flex items-center justify-between gap-2 rounded-lg bg-forest-soft border border-forest/10 px-3 py-2 text-xs font-semibold text-forest dark:bg-[#1B4332]/20 dark:text-[#52B788]"
                      >
                        <span className="truncate">{w.topic}</span>
                        <span className="tabular-nums shrink-0">{formatMasteryPercent(w.accuracy)}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="card"
          >
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[rgba(100,80,50,0.12)] bg-[rgba(100,80,50,0.03)] text-primary dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <Bot size={15} />
                </span>
                <div>
                  <div className="heading text-[13.5px] font-bold text-ink dark:text-white">Your AI coach</div>
                  <div className="text-[9.5px] font-semibold text-ink/40 dark:text-white/40 uppercase tracking-wider">Evaluation insight</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-ink/90 dark:text-white/90">
                <Typewriter text={result.coach_message} />
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="card p-6"
          >
            <h2 className="heading mb-1 flex items-center gap-2 text-sm sm:text-base font-bold text-ink dark:text-white">
              <TrendingUp size={15} className="text-primary dark:text-primary-light" /> 7-day focus plan
            </h2>
            <p className="text-xs text-ink/40 dark:text-white/40 mb-4">Targeted calendar generated by the diagnostic engine.</p>
            <div className="space-y-2.5">
              {plan === null && (
                <div className="flex items-center gap-2 text-xs text-ink/45 dark:text-white/40">
                  <Loader2 size={13} className="animate-spin text-primary dark:text-primary-light" /> Compiling weak area schedules...
                </div>
              )}
              {plan?.map((p, i) => (
                <motion.div
                  key={p.topic}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="rounded-lg border border-[rgba(100,80,50,0.12)] bg-[rgba(100,80,50,0.02)] p-4 dark:border-white/[0.06] dark:bg-white/[0.01]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip-primary font-bold !py-0.5">
                      Day {i + 1}
                    </span>
                    <span className="heading text-sm font-semibold text-ink dark:text-white">{p.topic}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-ink/55 dark:text-[#EDE8DF]">{p.advice}</p>
                  <p className="mt-1.5 text-[9px] font-semibold text-ink/40 dark:text-white/40 uppercase tracking-wider">{p.reason}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-center pt-2">
            <button onClick={() => router.push("/dashboard")} className="btn-primary cursor-pointer">
              Back to Dashboard <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
