"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  BrainCircuit,
  Gauge,
  Bot,
  Trophy,
  Target,
  ClipboardCheck,
  Zap,
  Infinity as InfinityIcon,
  Star,
  Check,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountUp from "@/components/CountUp";
import { MOCK_STREAMS } from "@/lib/mock-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const STEPS = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Take a Diagnostic Paper",
    body: "A calibrated 50-question mock test configured to your exam stream. No configuration needed — just start answering.",
  },
  {
    icon: BrainCircuit,
    step: "02",
    title: "Get an AI Evaluation",
    body: "Topic-level accuracy breakdowns, projected score charts, weak areas, and structured guidance from your AI coach.",
  },
  {
    icon: Gauge,
    step: "03",
    title: "Practice with Target Papers",
    body: "Auto-generate focus tests built around your exact mistakes. Track your topic mastery heatmaps as they progress.",
  },
];

const FEATURES = [
  {
    icon: Bot,
    title: "AI Coach Readouts",
    body: "A structured, text-based tutoring message explaining exact conceptual gaps after every test submission.",
  },
  {
    icon: TrendingUp,
    title: "Score Projection",
    body: "An advanced score predictor showing expected exam performance based on recent topic mastery.",
  },
  {
    icon: BrainCircuit,
    title: "Mastery Heatmaps",
    body: "Every topic mapped out from red (needs focus) to green (mastered). Track sub-topic scores dynamically.",
  },
  {
    icon: Target,
    title: "Weak-Topic Focus Tests",
    body: "One click composes custom practice tests compiled exclusively from your weak areas.",
  },
  {
    icon: Zap,
    title: "Streaks & Progress",
    body: "Daily consistency streaks and progress milestones built into your study profile.",
  },
  {
    icon: Trophy,
    title: "Exact Exam Standards",
    body: "Configured carefully for NEET, JEE Mains, JEE Advanced, and CBSE board specifications.",
  },
];

const MARQUEE_SUBJECTS = [
  "Physics", "Chemistry", "Biology", "Mathematics",
  "Organic Chemistry", "Genetics", "Electrostatics", "Calculus",
  "Thermodynamics", "Human Physiology", "Coordinate Geometry",
  "Cell Biology", "Kinematics", "Probability", "Modern Physics", "Algebra",
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-surface dark:bg-[#101114]">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-44">
        {/* Subtle warm grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-15"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(100,80,50,0.12) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {/* Top vignette */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-surface to-transparent dark:from-[#101114]" />
        {/* Warm ink border at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[rgba(100,80,50,0.12)] dark:bg-[rgba(255,230,180,0.07)]" />

        <div className="container-px relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left: Text */}
            <div className="space-y-7">
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
                <span className="section-eyebrow">
                  <Sparkles size={11} />
                  AI-Tutored Practice Engine
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={1}
                className="heading-display text-4xl sm:text-5xl lg:text-[60px] text-ink dark:text-[#EDE8DF]"
              >
                Study smarter.<br />
                <span style={{ color: "#3D3580" }} className="dark:text-[#7B74CC]">Score higher.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={2}
                className="max-w-lg text-[15px] leading-relaxed text-ink/55 dark:text-white/50"
              >
                Full-length diagnostic papers calibrated for NEET, JEE, and CBSE —
                graded by an AI tutoring system that writes your personal study plan.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={3}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Link href="/signin" className="btn-primary">
                  <BookOpen size={14} /> Start Free Diagnostic
                </Link>
                <Link href="#how" className="btn-ghost">
                  See How It Works <ArrowRight size={13} />
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={4}
                className="flex flex-wrap items-center gap-7 pt-1"
              >
                {[
                  { value: 50, suffix: "Q", label: "Per diagnostic paper" },
                  { value: 6,  suffix: "",  label: "Exam streams" },
                  { value: 720, suffix: "+", label: "Max score predicted" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col gap-0.5">
                    <span
                      style={{ fontFamily: '"Crimson Pro", Georgia, serif', fontWeight: 700 }}
                      className="text-2xl text-ink dark:text-[#EDE8DF]"
                    >
                      <CountUp value={s.value} suffix={s.suffix} />
                    </span>
                    <span className="label text-[10px]">{s.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:flex justify-center"
            >
              <div className="relative w-full max-w-[520px]">
                {/* Illustration frame */}
                <div className="relative overflow-hidden rounded-2xl border border-[rgba(100,80,50,0.15)] bg-ivory shadow-3 dark:border-[rgba(255,230,180,0.10)] dark:bg-[#1E2028]">
                  <Image
                    src="/illustrations/hero.png"
                    alt="Academic study environment illustration"
                    width={520}
                    height={390}
                    className="w-full object-cover"
                    priority
                  />
                  {/* Bottom gradient overlay */}
                  <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-ivory/85 to-transparent dark:from-[#1E2028]/85" />
                  <div className="absolute bottom-3 left-4">
                    <span className="chip-primary text-[10px]">
                      <Sparkles size={9} /> AI-powered analysis
                    </span>
                  </div>
                </div>

                {/* Floating mastery badge */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="absolute -right-5 top-8 rounded-xl border border-[rgba(100,80,50,0.15)] bg-ivory px-3.5 py-2.5 shadow-2 dark:border-[rgba(255,230,180,0.10)] dark:bg-[#1E2028]"
                >
                  <div className="text-[10.5px] font-medium text-ink/45 dark:text-white/40">Mastery Level</div>
                  <div
                    className="text-lg font-bold"
                    style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: "#2D6A4F" }}
                  >
                    87%
                  </div>
                </motion.div>

                {/* Floating score badge */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -left-5 bottom-20 rounded-xl border border-[rgba(100,80,50,0.15)] bg-ivory px-3.5 py-2.5 shadow-2 dark:border-[rgba(255,230,180,0.10)] dark:bg-[#1E2028]"
                >
                  <div className="text-[10.5px] font-medium text-ink/45 dark:text-white/40">Predicted Score</div>
                  <div
                    className="text-lg font-bold"
                    style={{ fontFamily: '"Crimson Pro", Georgia, serif', color: "#3D3580" }}
                  >
                    620 / 720
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Subject ticker ─────────────────────────────────────────── */}
      <section className="overflow-hidden border-y border-[rgba(100,80,50,0.12)] py-4 bg-surface-2 dark:border-[rgba(255,230,180,0.07)] dark:bg-[#17181D]">
        <div className="relative">
          <div className="flex w-max animate-marquee gap-2.5">
            {[...MARQUEE_SUBJECTS, ...MARQUEE_SUBJECTS].map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full border border-[rgba(100,80,50,0.18)] px-4 py-1 text-[11px] font-medium text-ink/40 dark:border-[rgba(255,230,180,0.10)] dark:text-white/35"
                style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
              >
                {s}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-surface-2 to-transparent dark:from-[#17181D]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-surface-2 to-transparent dark:from-[#17181D]" />
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section id="how" className="py-20 sm:py-28">
        <div className="container-px">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: true }} custom={0}
            className="mb-12 space-y-2"
          >
            <span className="section-eyebrow">Three steps</span>
            <h2
              className="max-w-xl text-3xl font-bold text-ink dark:text-[#EDE8DF] sm:text-4xl"
              style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
            >
              A structured path to mastery
            </h2>
          </motion.div>

          <div className="grid gap-px border border-[rgba(100,80,50,0.12)] bg-[rgba(100,80,50,0.08)] rounded-xl overflow-hidden sm:grid-cols-3 dark:border-[rgba(255,230,180,0.07)] dark:bg-[rgba(255,230,180,0.04)]">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="flex flex-col bg-surface p-8 dark:bg-[#101114]"
              >
                <span className="label mb-6 text-ink/20 dark:text-white/18">{s.step}</span>
                <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary dark:bg-primary/15 dark:text-primary-light">
                  <s.icon size={18} />
                </span>
                <h3 className="text-[15px] font-semibold text-ink dark:text-white">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/48 dark:text-white/45">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exam Streams ──────────────────────────────────────────── */}
      <section id="streams" className="border-t border-[rgba(100,80,50,0.10)] py-20 sm:py-28 dark:border-[rgba(255,230,180,0.06)]">
        <div className="container-px">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: true }} custom={0}
            className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="space-y-2">
              <span className="section-eyebrow">Exam Streams</span>
              <h2
                className="text-3xl font-bold text-ink dark:text-[#EDE8DF] sm:text-4xl"
                style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
              >
                Calibrated for your exam
              </h2>
            </div>
            <p className="max-w-xs text-[13px] text-ink/48 dark:text-white/45">
              Each stream has its own difficulty matrix, subject distribution, and marking scheme.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_STREAMS.map((s, i) => (
              <motion.div
                key={s.id}
                variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="group card flex flex-col justify-between p-6 transition-all hover:shadow-2 hover:border-[rgba(100,80,50,0.20)]"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[15px] font-semibold text-ink dark:text-white">{s.name}</h3>
                    <span
                      className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white"
                      style={{ background: s.accent }}
                    >
                      <Target size={13} />
                    </span>
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-ink/48 dark:text-white/45 min-h-[40px]">
                    {s.tagline}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.subjects.map((sub) => (
                      <span key={sub} className="chip text-[10.5px]">{sub}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-[rgba(100,80,50,0.08)] pt-4 dark:border-[rgba(255,230,180,0.06)]">
                  <span className="font-mono text-[10px] font-semibold text-ink/30 dark:text-white/30">
                    {s.difficultyMix.easy}% easy · {s.difficultyMix.medium}% med · {s.difficultyMix.hard}% hard
                  </span>
                  <Link href="/signin" className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline dark:text-primary-light">
                    Configure <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section id="features" className="border-t border-[rgba(100,80,50,0.10)] py-20 sm:py-28 dark:border-[rgba(255,230,180,0.06)] bg-surface-2 dark:bg-[#17181D]">
        <div className="container-px">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: true }} custom={0}
            className="mb-12 space-y-2"
          >
            <span className="section-eyebrow">Features</span>
            <h2
              className="max-w-lg text-3xl font-bold text-ink dark:text-[#EDE8DF] sm:text-4xl"
              style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
            >
              Built for score climbs, not for show
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="group card-parchment flex flex-col p-6 transition-all hover:shadow-2"
              >
                <span className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary dark:bg-primary/15 dark:text-primary-light">
                  <f.icon size={16} />
                </span>
                <h3 className="text-[14.5px] font-semibold text-ink dark:text-white">{f.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink/50 dark:text-white/45">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────── */}
      <section id="premium" className="py-20 sm:py-28">
        <div className="container-px">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: true }} custom={0}
            className="mb-12 space-y-2 text-center"
          >
            <span className="section-eyebrow">Pricing</span>
            <h2
              className="text-3xl font-bold text-ink dark:text-[#EDE8DF] sm:text-4xl"
              style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
            >
              Simple, honest plans
            </h2>
          </motion.div>

          <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
            {/* Free */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show"
              viewport={{ once: true }} custom={1}
              className="card flex flex-col justify-between p-7"
            >
              <div className="space-y-5">
                <div>
                  <h3 className="text-[14px] font-semibold text-ink/65 dark:text-white/65">Free</h3>
                  <div
                    className="mt-3 text-3xl font-bold text-ink dark:text-white"
                    style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
                  >
                    ₹0 <span className="text-sm font-normal text-ink/35 dark:text-white/35">/ forever</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-[12.5px] text-ink/55 dark:text-white/50">
                  <li className="flex items-center gap-2"><Check size={12} className="text-forest shrink-0" /> 2 mock tests per day</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-forest shrink-0" /> Diagnostic test & report</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-forest shrink-0" /> Basic stats dashboard</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-forest shrink-0" /> Achievements profile</li>
                </ul>
              </div>
              <Link href="/signin" className="btn-ghost btn-sm mt-7 w-full">
                Start Free
              </Link>
            </motion.div>

            {/* Premium */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show"
              viewport={{ once: true }} custom={2}
              className="relative flex flex-col justify-between overflow-hidden rounded-card border border-primary/20 bg-ivory p-7 shadow-2 dark:border-primary/25 dark:bg-[#1E2028]"
            >
              {/* Top accent line */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-primary" />
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-semibold text-primary dark:text-primary-light">Premium Access</h3>
                    <span className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-deep dark:bg-accent/15 dark:text-amber-300">
                      <Star size={8} fill="currentColor" /> Popular
                    </span>
                  </div>
                  <div
                    className="mt-3 text-3xl font-bold text-ink dark:text-white"
                    style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
                  >
                    ₹499 <span className="text-sm font-normal text-ink/35 dark:text-white/35">/ month</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-[12.5px] text-ink/60 dark:text-white/55">
                  <li className="flex items-center gap-2"><Check size={12} className="text-primary shrink-0" /><InfinityIcon size={11} /> Unlimited mock tests</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-primary shrink-0" /> Personal AI coach tutor</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-primary shrink-0" /> Heatmaps & score predictors</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-primary shrink-0" /> Custom focus tests</li>
                </ul>
              </div>
              <Link href="/signin" className="btn-primary btn-sm mt-7 w-full">
                Go Premium
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section className="border-t border-[rgba(100,80,50,0.10)] py-20 sm:py-24 dark:border-[rgba(255,230,180,0.06)] bg-[#2A2460] dark:bg-[#1A1740]">
        <div className="container-px">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}
            >
              50 Questions. One AI Tutor.<br />
              <span style={{ color: "#E0B04A" }}>Start your preparation today.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[13.5px] leading-relaxed text-white/50">
              Your diagnostic evaluation starts immediately, takes 60 minutes, and outputs
              clear guidance the moment you submit.
            </p>
            <Link href="/signin" className="btn-accent mt-8 inline-flex">
              Take Free Diagnostic <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
