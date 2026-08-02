"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Flag,
  FlagOff,
  Bookmark,
  BookmarkCheck,
  Grid,
  Send,
  Check,
  Loader2,
} from "lucide-react";
import type { Question, Test } from "@/lib/types";
import { cn } from "@/lib/utils";
import Timer from "./Timer";
import QuestionPalette from "./QuestionPalette";

const OPTION_LETTERS = ["A", "B", "C", "D"];

export interface PlayerAnswer {
  question_id: string;
  chosen: number;
}

export default function QuestionPlayer({
  test,
  timeLimitSec,
  onSubmit,
}: {
  test: Test;
  timeLimitSec: number;
  onSubmit: (answers: PlayerAnswer[], timeTakenSec: number) => Promise<void>;
}) {
  const [order, setOrder] = useState(() => test.questions.map((_, i) => i));
  const [answers, setAnswers] = useState<(number | null)[]>(() => test.questions.map(() => null));
  const [flagged, setFlagged] = useState<boolean[]>(() => test.questions.map(() => false));
  const [saved, setSaved] = useState<boolean[]>(() => test.questions.map(() => false));
  const [current, setCurrent] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimitSec);
  const submittedRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const questions = useMemo(() => order.map((i) => test.questions[i]), [order, test.questions]);
  const currentQuestion: Question = questions[current];

  const answeredCount = answers.filter((a) => a !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  const goTo = useCallback(
    (next: number) => {
      setCurrent(Math.max(0, Math.min(questions.length - 1, next)));
      setPaletteOpen(false);
    },
    [questions.length],
  );

  const selectOption = useCallback(
    (option: number) => {
      const qIdx = order[current];
      setAnswers((prev) => {
        const next = [...prev];
        next[qIdx] = option;
        return next;
      });
    },
    [order, current],
  );

  const toggleFlag = useCallback(() => {
    const qIdx = order[current];
    setFlagged((prev) => {
      const next = [...prev];
      next[qIdx] = !next[qIdx];
      return next;
    });
  }, [order, current]);

  const toggleSaved = useCallback(
    (qIdx: number) => {
      setSaved((prev) => {
        const next = [...prev];
        next[qIdx] = !next[qIdx];
        return next;
      });
    },
    [],
  );

  const reorder = useCallback((from: number, to: number) => {
    setOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }, []);

  const submit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    const payload = order.flatMap((qIdx) => {
      const chosen = answers[qIdx];
      if (chosen === null) return [];
      return [{ question_id: test.questions[qIdx].id, chosen }];
    });
    const timeTaken = Math.max(0, timeLimitSec - timeLeft);
    try {
      await onSubmit(payload, timeTaken);
    } finally {
      setSubmitting(false);
    }
  }, [order, answers, test.questions, timeLimitSec, timeLeft, onSubmit]);

  const handleExpire = useCallback(() => {
    setConfirmOpen(false);
    void submit();
  }, [submit]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "a" || k === "b" || k === "c" || k === "d") {
        e.preventDefault();
        selectOption(OPTION_LETTERS.indexOf(k.toUpperCase()));
      } else if (k === "arrowleft") {
        e.preventDefault();
        goTo(current - 1);
      } else if (k === "arrowright") {
        e.preventDefault();
        goTo(current + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo, selectOption]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 60) {
      if (dx < 0) goTo(current + 1);
      else goTo(current - 1);
    }
    touchStartX.current = null;
  };

  const diffBadge =
    currentQuestion.difficulty === "hard"
      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
      : currentQuestion.difficulty === "medium"
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

  return (
    <div className="flex min-h-screen flex-col bg-surface dark:bg-ink">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-ink/80">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <button
            onClick={() => setConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/50 transition-colors hover:text-crimson dark:text-white/50"
          >
            <ArrowLeft size={14} /> Exit Test
          </button>
          <div className="min-w-0 flex-1 text-center">
            <div className="truncate text-sm font-bold sm:text-base">{test.title}</div>
            <div className="text-[11px] text-black/45 dark:text-white/45 font-medium">
              Question {current + 1} of {questions.length} · {answeredCount} answered
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Timer totalSeconds={timeLimitSec} onExpire={handleExpire} onTick={setTimeLeft} compact />
            <button onClick={() => setConfirmOpen(true)} className="btn-primary btn-sm hidden sm:inline-flex">
              Submit
            </button>
            <button
              onClick={() => setPaletteOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-pill border border-black/10 lg:hidden dark:border-white/15 focus-visible:ring-2"
              aria-label="Toggle palette"
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
        <div className="h-1 bg-black/[0.04] dark:bg-white/10">
          <div
            className="h-full bg-crimson transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div
          className="touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="card p-5 sm:p-8 space-y-6 bg-white dark:bg-white/[0.02]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip border-crimson/20 bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light">
                  {currentQuestion.subject}
                </span>
                <span className="chip text-black/50 dark:text-white/40">{currentQuestion.topic}</span>
                <span className={cn("chip font-medium", diffBadge)}>{currentQuestion.difficulty}</span>
                <span className="chip text-black/40 dark:text-white/40 font-mono">Q{current + 1}</span>
              </div>
              <h2 className="heading text-lg leading-relaxed sm:text-xl font-medium">
                {currentQuestion.question}
              </h2>
              <div className="grid gap-3">
                {currentQuestion.options.map((opt, i) => {
                  const chosen = answers[order[current]] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => selectOption(i)}
                      className={cn(
                        "group flex items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left text-sm transition-all sm:text-[15px] focus-visible:ring-2",
                        chosen
                          ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light font-semibold"
                          : "border-black/5 bg-white/50 hover:border-black/10 dark:border-white/10 dark:bg-white/[0.01] dark:hover:border-white/20",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-sm transition-colors",
                          chosen
                            ? "bg-crimson text-white"
                            : "bg-black/5 text-black/60 group-hover:bg-crimson/10 group-hover:text-crimson dark:bg-white/10 dark:text-white/60",
                        )}
                      >
                        {OPTION_LETTERS[i]}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {chosen && <Check size={16} className="ml-auto shrink-0 text-crimson" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button onClick={toggleFlag} className="btn-ghost btn-sm !py-2.5">
                  {flagged[order[current]] ? <FlagOff size={15} /> : <Flag size={15} />}
                  {flagged[order[current]] ? "Unflag Question" : "Flag Question"}
                </button>
                <button
                  onClick={() => toggleSaved(order[current])}
                  className={cn(
                    "btn btn-sm !py-2.5",
                    saved[order[current]]
                      ? "border border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light"
                      : "btn-ghost",
                  )}
                >
                  {saved[order[current]] ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                  {saved[order[current]] ? "Saved" : "Save for later"}
                </button>
                <span className="ml-auto hidden text-[10px] font-medium text-black/35 sm:block dark:text-white/35">
                  Press A/B/C/D to choose · Arrow keys to navigate
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button onClick={() => goTo(current - 1)} disabled={current === 0} className="btn-ghost btn-sm !py-2.5">
              <ArrowLeft size={15} /> Prev
            </button>
            {current === questions.length - 1 ? (
              <button onClick={() => setConfirmOpen(true)} className="btn-primary btn-sm !py-2.5">
                Finish test <Send size={14} />
              </button>
            ) : (
              <button onClick={() => goTo(current + 1)} className="btn-primary btn-sm !py-2.5">
                Next <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="card sticky top-24 p-5 bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/10">
            <QuestionPalette
              order={order}
              currentIdx={current}
              answered={answers.map((a) => a !== null)}
              flagged={flagged}
              saved={saved}
              onJump={goTo}
              onReorder={reorder}
              onToggleSaved={toggleSaved}
            />
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setPaletteOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 dark:bg-ink border-t border-black/5 dark:border-white/10"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-pill bg-black/15 dark:bg-white/20" />
              <QuestionPalette
                order={order}
                currentIdx={current}
                answered={answers.map((a) => a !== null)}
                flagged={flagged}
                saved={saved}
                onJump={goTo}
                onReorder={reorder}
                onToggleSaved={toggleSaved}
              />
              <button onClick={() => setPaletteOpen(false)} className="btn-primary mt-4 w-full">
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmOpen && !submitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              className="card w-full max-w-md p-6 sm:p-8 bg-white dark:bg-ink border border-black/5 dark:border-white/10"
            >
              <h3 className="heading text-xl font-bold">Submit test?</h3>
              <p className="mt-2 text-sm text-black/55 dark:text-white/55">
                You answered <span className="font-bold text-crimson">{answeredCount}</span> of{" "}
                {questions.length} questions and flagged{" "}
                <span className="font-bold">{flagged.filter(Boolean).length}</span>.
              </p>
              {answeredCount < questions.length && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 p-2.5 rounded-lg">
                  {questions.length - answeredCount} unanswered — unanswered questions score zero.
                </p>
              )}
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button onClick={() => setConfirmOpen(false)} className="btn-ghost">
                  Keep working
                </button>
                <button onClick={() => void submit()} className="btn-primary">
                  <Send size={14} /> Submit now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {submitting && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-white/90 backdrop-blur-sm dark:bg-ink/95">
          <Loader2 size={32} className="animate-spin text-crimson" />
          <p className="text-sm font-semibold text-black/70 dark:text-white/70">
            Grading your test with the AI coach…
          </p>
        </div>
      )}
    </div>
  );
}
