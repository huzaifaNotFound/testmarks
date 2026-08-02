"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ClipboardCheck,
  BrainCircuit,
  Gauge,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  Target,
} from "lucide-react";
import { MOCK_STREAMS } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    icon: ClipboardCheck,
    title: "A mock test that thinks like your exam",
    body: "50 questions, 60 minutes, calibrated difficulty for your stream. No registration maze, no spam — just a diagnostic that tells the truth about where you stand.",
  },
  {
    icon: BrainCircuit,
    title: "Your AI coach reads every answer",
    body: "After you submit, the AI grades you topic by topic: weak areas in crimson, strong areas in green, plus a percentile estimate and a coaching message written for you.",
  },
  {
    icon: Gauge,
    title: "Analytics that track your climb",
    body: "Mastery heatmaps, score trends, a projected exam score predictor, streaks and badges. Every practice test makes the next one smarter.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser, setOnboarded, hydrated } = useAuth();
  const [slide, setSlide] = useState(0);
  const [picking, setPicking] = useState(false);
  const [stream, setStream] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "student") router.replace("/dashboard");
    if (user === null && hydrated) router.replace("/signin");
  }, [user, hydrated, router]);

  const chooseStream = async (id: string) => {
    setStream(id);
    if (!user) return;
    updateUser({ stream: id });
    setOnboarded(true);
    router.push(`/diagnostic?stream=${id}`);
  };

  const skip = () => {
    setOnboarded(true);
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-crimson opacity-[0.12] blur-[110px]" />

      <div className="container-px flex flex-1 flex-col py-8">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 font-heading text-lg font-bold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lgx bg-crimson text-white">
              <Target size={15} />
            </span>
            Test Marks AI
          </span>
          {!picking && (
            <button onClick={skip} className="text-sm font-medium text-black/45 hover:text-crimson dark:text-white/45">
              Skip <SkipForward size={13} className="ml-0.5 inline" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!picking ? (
            <motion.div
              key="walkthrough"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-10"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <span className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-card bg-crimson text-white shadow-glow-lg animate-float">
                    {(() => {
                      const S = SLIDES[slide].icon;
                      return <S size={36} />;
                    })()}
                  </span>
                  <h1 className="heading mx-auto mt-7 max-w-md text-2xl sm:text-3xl">{SLIDES[slide].title}</h1>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-black/55 sm:text-base dark:text-white/55">
                    {SLIDES[slide].body}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex items-center justify-center gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={cn(
                      "h-2 rounded-pill transition-all",
                      i === slide ? "w-8 bg-crimson" : "w-2 bg-black/15 hover:bg-black/30 dark:bg-white/20",
                    )}
                  />
                ))}
              </div>

              <div className="mx-auto mt-8 flex w-full max-w-xs items-center gap-3">
                <button
                  onClick={() => setSlide((s) => Math.max(0, s - 1))}
                  disabled={slide === 0}
                  className="btn-ghost flex-1 disabled:opacity-30"
                >
                  <ChevronLeft size={16} /> Back
                </button>
                {slide < SLIDES.length - 1 ? (
                  <button onClick={() => setSlide((s) => s + 1)} className="btn-primary flex-1">
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button onClick={() => setPicking(true)} className="btn-primary flex-1">
                    Choose stream <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="streams"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto w-full max-w-3xl flex-1 py-10"
            >
              <h1 className="heading text-center text-2xl sm:text-4xl">Which exam are you preparing for?</h1>
              <p className="mt-2 text-center text-sm text-black/50 dark:text-white/50">
                Your diagnostic test is built from the syllabus and difficulty mix of this stream.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {MOCK_STREAMS.map((s, i) => (
                  <motion.button
                    key={s.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.4 }}
                    onClick={() => chooseStream(s.id)}
                    className={cn(
                      "card group relative overflow-hidden p-6 text-left transition-all hover:-translate-y-1 hover:shadow-soft",
                      stream === s.id && "ring-2 ring-crimson",
                    )}
                  >
                    <div
                      className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.15] blur-2xl transition-opacity group-hover:opacity-30"
                      style={{ background: s.accent }}
                    />
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-lgx text-white transition-transform group-hover:scale-110"
                      style={{ background: s.accent, boxShadow: `0 10px 28px ${s.accent}55` }}
                    >
                      <Target size={19} />
                    </span>
                    <div className="heading mt-4 text-lg">{s.name}</div>
                    <div className="mt-1 text-xs text-black/50 dark:text-white/50">{s.tagline}</div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.subjects.map((sub) => (
                        <span key={sub} className="chip text-[10px]">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button onClick={skip} className="text-sm font-medium text-black/45 hover:text-crimson dark:text-white/45">
                  Skip for now — go to dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!user && hydrated && (
          <p className="pb-4 text-center text-xs text-black/40 dark:text-white/40">
            Redirecting to sign in…
          </p>
        )}
      </div>
    </div>
  );
}
