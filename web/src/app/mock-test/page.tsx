"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, ArrowLeft, Target } from "lucide-react";
import QuestionPlayer, { type PlayerAnswer } from "@/components/QuestionPlayer";
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

  return (
    <RequireAuth>
      <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[380px] w-[640px] -translate-x-1/2 rounded-full bg-crimson opacity-[0.12] blur-[110px]" />
      <div className="container-px mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => router.push("/dashboard")} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-black/50 hover:text-crimson dark:text-white/50">
            <ArrowLeft size={15} /> Dashboard
          </button>
          <span className="chip border-crimson/30 bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light">
            <Sparkles size={13} /> AI-generated
          </span>
          <h1 className="heading mt-4 text-3xl sm:text-4xl">Build your mock test</h1>
          <p className="mt-2 text-sm text-black/55 dark:text-white/55">
            The AI composes a fresh paper from the syllabus of your stream in seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mt-8 space-y-7 p-6 sm:p-8"
        >
          <div>
            <div className="label mb-3">Stream</div>
            <div className="flex flex-wrap gap-2">
              {MOCK_STREAMS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setStream(s.id);
                    setSubject(null);
                  }}
                  className={cn(
                    "chip !px-4 !py-2 text-sm",
                    stream === s.id
                      ? "border-transparent text-white shadow-glow"
                      : "border-black/10 hover:border-crimson dark:border-white/15",
                  )}
                  style={stream === s.id ? { background: s.accent } : undefined}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="label mb-3">Focus subject (optional)</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSubject(null)}
                className={cn(
                  "chip !px-4 !py-2 text-sm",
                  subject === null ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light" : "hover:border-crimson",
                )}
              >
                Mixed
              </button>
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  className={cn(
                    "chip !px-4 !py-2 text-sm",
                    subject === s ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light" : "hover:border-crimson",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="label mb-3">Difficulty (optional)</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDifficulty(null)}
                className={cn(
                  "chip !px-4 !py-2 text-sm",
                  difficulty === null ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light" : "hover:border-crimson",
                )}
              >
                Mixed
              </button>
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={cn(
                    "chip !px-4 !py-2 text-sm",
                    difficulty === d.id ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light" : "hover:border-crimson",
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="label mb-3">Question count</div>
            <div className="flex flex-wrap gap-2">
              {[10, 20, 30, 50].map((c) => (
                <button
                  key={c}
                  onClick={() => setCount(c)}
                  className={cn(
                    "chip !px-4 !py-2 text-sm",
                    count === c ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light" : "hover:border-crimson",
                  )}
                >
                  {c} questions
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {generating ? (
              <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-3 py-4">
                <Loader2 size={22} className="animate-spin text-crimson" />
                <span className="text-sm font-semibold text-black/55 dark:text-white/55">
                  AI is composing {count} questions…
                </span>
              </motion.div>
            ) : (
              <motion.button
                key="btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleGenerate}
                className="btn-primary w-full py-4 text-base"
              >
                <Target size={18} /> Generate & start test
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      </div>
      </RequireAuth>
  );
}
