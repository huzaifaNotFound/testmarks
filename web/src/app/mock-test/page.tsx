"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, ArrowLeft, Target } from "lucide-react";
import QuestionPlayer, { type PlayerAnswer } from "@/components/QuestionPlayer";
import { PageHeader } from "@/components/ui";
import { generateTest, submitAttempt } from "@/lib/api";
import { RequireAuth, useAuth } from "@/lib/auth";
import { MOCK_STREAMS, MOCK_TIME_LIMIT_SEC, STREAM_SUBJECT_TOPICS } from "@/lib/mock-data";
import { saveResult } from "@/lib/result-store";
import type { Difficulty, Test } from "@/lib/types";
import { cn } from "@/lib/utils";

const DIFFICULTIES: { id: Difficulty; label: string }[] = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

export default function MockTestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stream, setStream] = useState(user?.stream ?? "neet");
  const [subject, setSubject] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [count, setCount] = useState(30);
  const [generating, setGenerating] = useState(false);
  const [test, setTest] = useState<Test | null>(null);

  const subjects = useMemo(
    () => [...new Set((STREAM_SUBJECT_TOPICS[stream] ?? []).map((p) => p.subject))],
    [stream],
  );

  const handleGenerate = async () => {
    setGenerating(true);
    const t = await generateTest({
      user_id: user?.id ?? "",
      stream,
      focus_topics: subject ? [subject] : undefined,
      difficulty: difficulty ?? undefined,
      count,
    });
    setTest(t);
    setGenerating(false);
  };

  const handleSubmit = async (answers: PlayerAnswer[], timeTakenSec: number) => {
    if (!test) return;
    const result = await submitAttempt(
      {
        user_id: user?.id ?? "",
        test_id: test.test_id,
        answers,
        time_taken_sec: timeTakenSec,
      },
      test,
    );
    saveResult({
      result,
      test: { test_id: test.test_id, title: test.title, stream: test.stream },
      timeTakenSec,
      generated: true,
      at: new Date().toISOString(),
    });
    router.push("/report");
  };

  if (test) {
    return <QuestionPlayer test={test} timeLimitSec={MOCK_TIME_LIMIT_SEC} onSubmit={handleSubmit} />;
  }

  const selectedStreamObj = MOCK_STREAMS.find(s => s.id === stream);

  return (
    <RequireAuth>
      <div className="relative min-h-screen bg-surface dark:bg-[#0D0D10] py-10 sm:py-16">
        <div className="container-px mx-auto flex w-full max-w-2xl flex-col">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/45 hover:text-crimson dark:text-white/45 transition-colors"
            >
              <ArrowLeft size={13} /> Back to dashboard
            </button>
            <PageHeader
              title="Build your mock test"
              subtitle="The AI agent composes a fresh exam paper matching your syllabus in seconds."
              actions={
                <span className="chip-crimson">
                  <Sparkles size={11} /> AI Engine v1.0
                </span>
              }
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            className="card mt-6 space-y-6 p-6 sm:p-8"
          >
            <div>
              <div className="label mb-2 text-black/50 dark:text-white/40">Stream</div>
              <div className="flex flex-wrap gap-2">
                {MOCK_STREAMS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setStream(s.id);
                      setSubject(null);
                    }}
                    className={cn(
                      "chip !px-3.5 !py-1.5 text-xs font-semibold transition-all focus-visible:ring-2",
                      stream === s.id
                        ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light font-bold"
                        : "border-black/[0.08] bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] hover:border-crimson/50",
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="label mb-2 text-black/50 dark:text-white/40">Focus subject (optional)</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSubject(null)}
                  className={cn(
                    "chip !px-3.5 !py-1.5 text-xs font-semibold focus-visible:ring-2",
                    subject === null
                      ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light font-bold"
                      : "border-black/[0.08] bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] hover:border-crimson/50",
                  )}
                >
                  Mixed Syllabus
                </button>
                {subjects.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className={cn(
                      "chip !px-3.5 !py-1.5 text-xs font-semibold focus-visible:ring-2",
                      subject === s
                        ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light font-bold"
                        : "border-black/[0.08] bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] hover:border-crimson/50",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="label mb-2 text-black/50 dark:text-white/40">Difficulty (optional)</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setDifficulty(null)}
                  className={cn(
                    "chip !px-3.5 !py-1.5 text-xs font-semibold focus-visible:ring-2",
                    difficulty === null
                      ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light font-bold"
                      : "border-black/[0.08] bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] hover:border-crimson/50",
                  )}
                >
                  Mixed Difficulty
                </button>
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={cn(
                      "chip !px-3.5 !py-1.5 text-xs font-semibold focus-visible:ring-2",
                      difficulty === d.id
                        ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light font-bold"
                        : "border-black/[0.08] bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] hover:border-crimson/50",
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="label mb-2 text-black/50 dark:text-white/40">Question count</div>
              <div className="flex flex-wrap gap-2">
                {[10, 20, 30, 50].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCount(c)}
                    className={cn(
                      "chip !px-3.5 !py-1.5 text-xs font-semibold focus-visible:ring-2",
                      count === c
                        ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light font-bold"
                        : "border-black/[0.08] bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.02] hover:border-crimson/50",
                    )}
                  >
                    {c} questions
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div
                    key="gen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-3 py-6 rounded-lg border border-black/[0.06] bg-black/[0.015] dark:border-white/[0.06] dark:bg-white/[0.02]"
                  >
                    <Loader2 size={20} className="animate-spin text-crimson" />
                    <span className="text-xs font-semibold text-black/55 dark:text-white/55">
                      AI is generating {count} questions for your {selectedStreamObj?.name ?? " नीट / जेईई "} stream...
                    </span>
                  </motion.div>
                ) : (
                  <motion.button
                    key="btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleGenerate}
                    className="btn-primary w-full py-3"
                  >
                    <Target size={16} /> Generate & Start Test
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </RequireAuth>
  );
}
