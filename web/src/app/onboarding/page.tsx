"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    <div className="relative flex min-h-screen flex-col bg-surface dark:bg-[#101114]">
      <div className="container-px flex flex-col flex-1 py-6 sm:py-8">
        <header className="flex items-center justify-between border-b border-[rgba(100,80,50,0.12)] pb-4 dark:border-white/[0.06]">
          <Logo />
          {!picking && (
            <button
              onClick={skip}
              className="inline-flex items-center gap-1 text-xs font-semibold text-ink/45 hover:text-primary dark:text-white/45 transition-colors focus-visible:ring-2 cursor-pointer"
            >
              Skip Walkthrough <SkipForward size={12} />
            </button>
          )}
        </header>

        <div className="flex-1 flex flex-col justify-center py-6 sm:py-8">
          {!picking ? (
            <div className="mx-auto w-full max-w-xl flex flex-col justify-center">
              {/* Onboarding Artwork */}
              <div className="relative mx-auto mb-6 aspect-[16/9] w-full max-w-[400px] overflow-hidden rounded-xl border border-[rgba(100,80,50,0.15)] bg-white shadow-2 dark:border-white/[0.06] dark:bg-[#1E2028]">
                <Image
                  src="/illustrations/onboarding.png"
                  alt="Onboarding path"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="text-center min-h-[160px] flex flex-col items-center justify-center">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(100,80,50,0.12)] bg-[rgba(100,80,50,0.03)] text-primary dark:border-white/[0.06] dark:bg-white/[0.02]">
                  {(() => {
                    const IconComponent = SLIDES[slide].icon;
                    return <IconComponent size={16} />;
                  })()}
                </span>
                <h1 className="heading mt-4 text-xl sm:text-2xl font-bold tracking-tight">
                  {SLIDES[slide].title}
                </h1>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink/50 dark:text-white/50">
                  {SLIDES[slide].body}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-1.5">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={cn(
                      "h-1 rounded-full transition-all cursor-pointer",
                      i === slide ? "w-5 bg-primary" : "w-1 bg-black/15 hover:bg-black/30 dark:bg-white/20",
                    )}
                  />
                ))}
              </div>

              <div className="mx-auto mt-6 flex w-full max-w-xs items-center gap-2.5">
                <button
                  onClick={() => setSlide((s) => Math.max(0, s - 1))}
                  disabled={slide === 0}
                  className="btn-ghost btn-sm flex-1 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft size={13} /> Back
                </button>
                {slide < SLIDES.length - 1 ? (
                  <button
                    onClick={() => setSlide((s) => s + 1)}
                    className="btn-primary btn-sm flex-1 cursor-pointer"
                  >
                    Next <ChevronRight size={13} />
                  </button>
                ) : (
                  <button
                    onClick={() => setPicking(true)}
                    className="btn-primary btn-sm flex-1 font-bold cursor-pointer"
                  >
                    Get Started <ChevronRight size={13} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-3xl">
              <h1 className="heading text-center text-xl sm:text-2xl font-bold tracking-tight">Which exam are you preparing for?</h1>
              <p className="mt-1 text-center text-xs sm:text-sm text-ink/50 dark:text-white/50">
                Your primary diagnostic test and mock papers will target this specific syllabus.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {MOCK_STREAMS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => chooseStream(s.id)}
                    className={cn(
                      "card group text-left p-5 transition-all hover:border-[rgba(100,80,50,0.20)] dark:hover:border-white/20 focus-visible:ring-2 cursor-pointer",
                      stream === s.id && "ring-1 ring-primary border-primary/50",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white"
                        style={{ background: s.accent }}
                      >
                        <Target size={14} />
                      </span>
                      <span className="text-[10px] font-semibold text-ink/40 dark:text-white/40">
                        {s.difficultyMix.hard}% Advanced
                      </span>
                    </div>
                    <div className="heading mt-4 text-base font-bold text-ink dark:text-white">{s.name}</div>
                    <div className="mt-0.5 text-xs text-ink/50 dark:text-white/50">{s.tagline}</div>
                    <div className="mt-4 flex flex-wrap gap-1">
                      {s.subjects.map((sub) => (
                        <span key={sub} className="chip text-[9.5px] px-2 py-0.5">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button onClick={skip} className="text-xs font-semibold text-ink/45 hover:text-primary dark:text-white/45 transition-colors focus-visible:ring-2 cursor-pointer">
                  Configure later — go to dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {!user && hydrated && (
          <p className="pb-4 text-center text-[10px] text-ink/40 dark:text-white/40">
            Authenticating and loading account context...
          </p>
        )}
      </div>
    </div>
  );
}
