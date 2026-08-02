"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import Logo from "@/components/Logo";

const SLIDES = [
  {
    icon: ClipboardCheck,
    title: "Diagnostic tests configured for your exam",
    body: "50 questions, timed, and calibrated carefully to your exact syllabus stream. No registration mazes, just data on where you stand.",
  },
  {
    icon: BrainCircuit,
    title: "AI analysis behind every answer",
    body: "The engine maps your skills topic by topic. View clear weaknesses, mastery milestones, projected scores and custom advice.",
  },
  {
    icon: Gauge,
    title: "Analytics tracking your progress",
    body: "Mastery grids, score trends, expected percentile, streaks and achievements. Each test shapes a smarter diagnostic path.",
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
    <div className="relative flex min-h-screen flex-col bg-surface dark:bg-ink">
      <div className="container-px flex flex-col flex-1 py-8">
        <header className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
          <Logo />
          {!picking && (
            <button
              onClick={skip}
              className="inline-flex items-center gap-1 text-xs font-semibold text-black/50 hover:text-crimson dark:text-white/45 transition-colors focus-visible:ring-2"
            >
              Skip Walkthrough <SkipForward size={12} />
            </button>
          )}
        </header>

        <div className="flex-1 flex flex-col justify-center py-8">
          {!picking ? (
            <div className="mx-auto w-full max-w-xl flex flex-col justify-center">
              <div className="text-center min-h-[280px] flex flex-col items-center justify-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light shadow-sm">
                  {(() => {
                    const IconComponent = SLIDES[slide].icon;
                    return <IconComponent size={28} />;
                  })()}
                </span>
                <h1 className="heading mt-6 text-2xl sm:text-3xl font-bold tracking-tight">
                  {SLIDES[slide].title}
                </h1>
                <p className="mt-3.5 text-sm leading-relaxed text-black/55 dark:text-white/55">
                  {SLIDES[slide].body}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === slide ? "w-6 bg-crimson" : "w-1.5 bg-black/15 hover:bg-black/30 dark:bg-white/20",
                    )}
                  />
                ))}
              </div>

              <div className="mx-auto mt-8 flex w-full max-w-xs items-center gap-3">
                <button
                  onClick={() => setSlide((s) => Math.max(0, s - 1))}
                  disabled={slide === 0}
                  className="btn-ghost btn-sm flex-1 disabled:opacity-30"
                >
                  <ChevronLeft size={14} /> Back
                </button>
                {slide < SLIDES.length - 1 ? (
                  <button
                    onClick={() => setSlide((s) => s + 1)}
                    className="btn-primary btn-sm flex-1"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => setPicking(true)}
                    className="btn-primary btn-sm flex-1 font-bold"
                  >
                    Choose Stream <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-3xl">
              <h1 className="heading text-center text-2xl sm:text-3xl font-bold tracking-tight">Which exam are you preparing for?</h1>
              <p className="mt-2 text-center text-sm text-black/50 dark:text-white/50">
                Your primary diagnostic test and mock papers will target this specific syllabus.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {MOCK_STREAMS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => chooseStream(s.id)}
                    className={cn(
                      "card group text-left p-6 transition-all hover:border-black/25 dark:hover:border-white/25 focus-visible:ring-2",
                      stream === s.id && "ring-2 ring-crimson",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white"
                        style={{ background: s.accent }}
                      >
                        <Target size={18} />
                      </span>
                      <span className="text-xs font-semibold text-black/40 dark:text-white/40">
                        {s.difficultyMix.hard}% Advanced
                      </span>
                    </div>
                    <div className="heading mt-4 text-lg font-bold">{s.name}</div>
                    <div className="mt-1 text-xs text-black/50 dark:text-white/50">{s.tagline}</div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {s.subjects.map((sub) => (
                        <span key={sub} className="chip text-[10px]">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button onClick={skip} className="text-sm font-semibold text-black/45 hover:text-crimson dark:text-white/45 transition-colors focus-visible:ring-2">
                  Configure later — go to dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {!user && hydrated && (
          <p className="pb-4 text-center text-xs text-black/40 dark:text-white/40">
            Authenticating and loading account context...
          </p>
        )}
      </div>
    </div>
  );
}
