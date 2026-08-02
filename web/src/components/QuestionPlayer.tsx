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
      ? "chip-danger"
      : currentQuestion.difficulty === "medium"
        ? "chip-warning"
        : "chip-success";

  return (
    <div className="flex min-h-screen flex-col bg-surface dark:bg-[#101114]">
      <header className="sticky top-0 z-40 border-b border-[rgba(100,80,50,0.12)] bg-[#F6F3EC]/90 backdrop-blur-md dark:border-white/[0.07] dark:bg-[#101114]/90">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <button
            onClick={() => setConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/45 transition-colors hover:text-primary dark:text-white/45 cursor-pointer"
          >
            <ArrowLeft size={14} /> Exit Test
          </button>
          <div className="min-w-0 flex-1 text-center">
            <div className="truncate text-sm font-bold text-ink dark:text-white">{test.title}</div>
            <div className="text-[11px] text-ink/45 dark:text-white/45 font-semibold">
              Question {current + 1} of {questions.length} · {answeredCount} answered
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Timer totalSeconds={timeLimitSec} onExpire={handleExpire} onTick={setTimeLeft} compact />
            <button onClick={() => setConfirmOpen(true)} className="btn-primary btn-sm hidden sm:inline-flex cursor-pointer">
              Submit
            </button>
            <button
              onClick={() => setPaletteOpen((v) => !v)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(100,80,50,0.18)] lg:hidden dark:border-white/10 focus-visible:ring-2 cursor-pointer"
              aria-label="Toggle palette"
            >
              <Grid size={15} />
            </button>
          </div>
        </div>
        <div className="h-1 bg-[rgba(100,80,50,0.06)] dark:bg-white/10">
          <div
            className="h-full bg-primary transition-all duration-300"
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
              className="card p-5 sm:p-8 space-y-5"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="chip-primary">
                  {currentQuestion.subject}
                </span>
                <span className="chip">{currentQuestion.topic}</span>
                <span className={cn("chip font-semibold", diffBadge)}>{currentQuestion.difficulty}</span>
                <span className="chip font-mono">Q{current + 1}</span>
              </div>
              <h2 className="heading text-base leading-relaxed sm:text-lg font-medium text-ink dark:text-white">
                {currentQuestion.question}
              </h2>
              <div className="grid gap-2.5">
                {currentQuestion.options.map((opt, i) => {
                  const chosen = answers[order[current]] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => selectOption(i)}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-[13.5px] transition-all sm:text-[14.5px] focus-visible:ring-2 cursor-pointer",
                        chosen
                          ? "border-primary bg-primary-soft text-primary dark:bg-primary/15 dark:text-primary-light font-semibold"
                          : "border-[rgba(100,80,50,0.12)] bg-ivory/50 hover:border-primary/50 dark:border-white/10 dark:bg-[#1E2028]/50 dark:hover:border-white/20",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-colors",
                          chosen
                            ? "bg-primary text-white"
                            : "bg-black/[0.04] text-ink/55 group-hover:bg-primary/10 group-hover:text-primary dark:bg-white/[0.08] dark:text-white/50",
                        )}
                      >
                        {OPTION_LETTERS[i]}
                      </span>
                      <span className="flex-1 text-ink dark:text-white">{opt}</span>
                      {chosen && <Check size={14} className="ml-auto shrink-0 text-primary" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button onClick={toggleFlag} className="btn-ghost btn-sm !py-2 cursor-pointer">
                  {flagged[order[current]] ? <FlagOff size={14} /> : <Flag size={14} />}
                  {flagged[order[current]] ? "Unflag" : "Flag"}
                </button>
                <button
                  onClick={() => toggleSaved(order[current])}
                  className={cn(
                    "btn btn-sm !py-2 cursor-pointer",
                    saved[order[current]]
                      ? "border border-primary bg-primary-soft text-primary dark:bg-primary/15 dark:text-primary-light"
                      : "btn-ghost",
                  )}
                >
                  {saved[order[current]] ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                  {saved[order[current]] ? "Saved" : "Save for later"}
                </button>
                <span className="ml-auto hidden text-[10px] font-medium text-ink/35 sm:block dark:text-white/35">
                  Press A/B/C/D to choose · Arrow keys to navigate
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button onClick={() => goTo(current - 1)} disabled={current === 0} className="btn-ghost btn-sm !py-2 cursor-pointer">
              <ArrowLeft size={14} /> Prev
            </button>
            {current === questions.length - 1 ? (
              <button onClick={() => setConfirmOpen(true)} className="btn-primary btn-sm !py-2 cursor-pointer">
                Finish test <Send size={13} />
              </button>
            ) : (
              <button onClick={() => goTo(current + 1)} className="btn-primary btn-sm !py-2 cursor-pointer">
                Next <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="card sticky top-20 p-5 bg-ivory dark:bg-[#17181D]">
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
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm lg:hidden"
            onClick={() => setPaletteOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-ivory p-5 dark:bg-[#17181D] border-t border-[rgba(100,80,50,0.15)] dark:border-white/[0.07]"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-black/10 dark:bg-white/10" />
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
              <button onClick={() => setPaletteOpen(false)} className="btn-primary mt-4 w-full cursor-pointer">
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
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              className="card w-full max-w-md p-6 text-center bg-ivory dark:bg-[#1E2028]"
            >
              <h3 className="heading text-lg font-bold text-ink dark:text-white">Submit test?</h3>
              <p className="mt-2 text-xs sm:text-sm text-ink/55 dark:text-white/55">
                You answered <span className="font-bold text-primary dark:text-primary-light">{answeredCount}</span> of{" "}
                {questions.length} questions and flagged{" "}
                <span className="font-bold text-ink dark:text-white">{flagged.filter(Boolean).length}</span>.
              </p>
              {answeredCount < questions.length && (
                <p className="mt-2.5 text-xs text-amber-700 dark:text-amber-300 font-semibold bg-accent-soft p-2.5 rounded-lg border border-accent/10">
                  {questions.length - answeredCount} unanswered — unanswered questions score zero.
                </p>
              )}
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button onClick={() => setConfirmOpen(false)} className="btn-ghost cursor-pointer">
                  Keep working
                </button>
                <button onClick={() => void submit()} className="btn-primary cursor-pointer">
                  <Send size={13} /> Submit now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {submitting && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-[#F6F3EC]/95 backdrop-blur-sm dark:bg-[#101114]/95">
          <Loader2 size={24} className="animate-spin text-primary dark:text-primary-light" />
          <p className="text-sm font-semibold text-ink dark:text-white">
            Grading your test with the AI coach…
          </p>
        </div>
      )}
    </div>
  );
}
