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
import { formatTime, cn, formatMasteryPercent } from "@/lib/utils";
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
      <div className="relative min-h-screen bg-surface dark:bg-ink">
        <Confetti active={confetti} />

        <div className="container-px max-w-5xl py-10 sm:py-16 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <span className="chip border-crimson/25 bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light">
              <Bot size={13} /> AI evaluation complete
            </span>
            <h1 className="heading text-3xl sm:text-5xl font-extrabold tracking-tight">{stored.test.title}</h1>
            <p className="text-sm text-black/50 dark:text-white/45">
              Subject mastery evaluation · {Math.round(result.percentile_est)}th percentile estimate
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="card flex flex-col items-center justify-center gap-6 p-7 bg-white dark:bg-white/[0.01] border-black/5 dark:border-white/10"
            >
              <ScoreRing score={result.score} total={result.total} />
              <div className="grid w-full grid-cols-2 gap-3">
                <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-3.5 text-center">
                  <Percent size={14} className="mx-auto text-crimson" />
                  <div className="heading mt-1.5 text-lg font-bold">{Math.round(result.accuracy * 100)}%</div>
                  <div className="label text-[9px]">Accuracy</div>
                </div>
                <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-3.5 text-center">
                  <TimerIcon size={14} className="mx-auto text-crimson" />
                  <div className="heading mt-1.5 text-lg font-bold">{formatTime(timeTakenSec)}</div>
                  <div className="label text-[9px]">Time taken</div>
                </div>
                <div className="col-span-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-3.5 text-center">
                  <TrendingUp size={14} className="mx-auto text-crimson" />
                  <div className="heading mt-1.5 text-lg font-bold">{result.percentile_est}th</div>
                  <div className="label text-[9px]">Estimated Percentile</div>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="card p-6 bg-white dark:bg-white/[0.01] border-black/5 dark:border-white/10"
              >
                <h2 className="heading mb-5 flex items-center gap-2 text-base font-bold text-black/80 dark:text-white/80">
                  <ListChecks size={16} className="text-crimson" /> Topic breakdown
                </h2>
                <div className="space-y-4">
                  {result.per_topic.map((t) => (
                    <div key={`${t.subject}-${t.topic}`} className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-2 text-xs">
                        <span className="font-semibold text-black/80 dark:text-white/80">
                          {t.topic}
                          <span className="ml-2 font-normal text-black/40 dark:text-white/40">{t.subject}</span>
                        </span>
                        <span className="font-bold tabular-nums">
                          {t.correct}/{t.total}
                          <span className={cn("ml-2 font-semibold", t.accuracy >= 0.6 ? "text-success" : "text-danger")}>
                            {Math.round(t.accuracy * 100)}%
                          </span>
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-black/[0.04] dark:bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(t.total / maxBar) * 100}%` }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="h-full rounded-full bg-crimson/80"
                        />
                        <div className="relative -mt-2 h-2">
                          <motion.div
                            initial={{ left: 0 }}
                            animate={{ left: `${t.accuracy * 100}%` }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="absolute top-0 h-2 w-1.5 rounded-full bg-ink dark:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="grid gap-5 sm:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card border-crimson/10 p-5 bg-white dark:bg-white/[0.01]"
                >
                  <h3 className="heading flex items-center gap-2 text-xs uppercase tracking-wider text-crimson font-bold">
                    <Brain size={14} /> Weak areas
                  </h3>
                  <div className="mt-3 space-y-2">
                    {result.weak_areas.length === 0 && <p className="text-xs text-black/40 dark:text-white/40">No weak areas detected. Outstanding performance.</p>}
                    {result.weak_areas.map((w) => (
                      <div key={w.topic} className="flex items-center justify-between gap-2 rounded-lg bg-crimson-soft/40 px-3 py-2 text-xs font-semibold text-crimson dark:bg-crimson/10 dark:text-crimson-light">
                        <span className="truncate">{w.topic}</span>
                        <span className="tabular-nums shrink-0">{formatMasteryPercent(w.accuracy)}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="card border-success/10 p-5 bg-white dark:bg-white/[0.01]"
                >
                  <h3 className="heading flex items-center gap-2 text-xs uppercase tracking-wider text-success font-bold">
                    <Target size={14} /> Strong areas
                  </h3>
                  <div className="mt-3 space-y-2">
                    {result.strong_areas.length === 0 && <p className="text-xs text-black/45 dark:text-white/45">Practice more to record mastery milestones here.</p>}
                    {result.strong_areas.map((w) => (
                      <div key={w.topic} className="flex items-center justify-between gap-2 rounded-lg bg-success/10 px-3 py-2 text-xs font-semibold text-success">
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
            transition={{ delay: 0.3 }}
            className="card bg-white dark:bg-white/[0.01] border-black/5 dark:border-white/10"
          >
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-crimson/10 text-crimson dark:bg-crimson/15">
                  <Bot size={18} />
                </span>
                <div>
                  <div className="heading text-sm font-bold">Your AI coach</div>
                  <div className="text-[10px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider">Evaluation insight</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-black/80 dark:text-white/80 sm:text-base">
                <Typewriter text={result.coach_message} />
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="card p-6 bg-white dark:bg-white/[0.01] border-black/5 dark:border-white/10"
          >
            <h2 className="heading mb-1.5 flex items-center gap-2 text-base font-bold text-black/80 dark:text-white/80">
              <TrendingUp size={16} className="text-crimson" /> 7-day focus plan
            </h2>
            <p className="text-xs text-black/40 dark:text-white/40 mb-4">Targeted calendar generated by the diagnostic engine.</p>
            <div className="space-y-3">
              {plan === null && (
                <div className="flex items-center gap-2 text-xs text-black/45 dark:text-white/40">
                  <Loader2 size={13} className="animate-spin text-crimson" /> Compiling weak area schedules...
                </div>
              )}
              {plan?.map((p, i) => (
                <motion.div
                  key={p.topic}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="rounded-xl border border-black/5 bg-black/[0.01] p-4 dark:border-white/5 dark:bg-white/[0.01]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip border-crimson/20 bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light font-bold">
                      Day {i + 1}
                    </span>
                    <span className="heading text-sm font-semibold">{p.topic}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-black/60 dark:text-white/60">{p.advice}</p>
                  <p className="mt-1.5 text-[10px] font-semibold text-black/40 dark:text-white/45 uppercase tracking-wider">{p.reason}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-center pt-4">
            <button onClick={() => router.push("/dashboard")} className="btn-primary px-8 py-3.5">
              Back to Dashboard <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
