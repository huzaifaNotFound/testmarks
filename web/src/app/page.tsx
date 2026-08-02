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
    icon: Gauge,
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
    title: "Streaks & achievements",
    body: "Simple badges and daily consistency streaks built directly into your profile dashboard.",
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
    <div className="flex min-h-screen flex-col bg-surface dark:bg-[#0D0D10]">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-40">
        {/* Subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Warm top vignette */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-surface to-transparent dark:from-[#0D0D10]" />

        <div className="container-px relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Text */}
            <div className="space-y-6">
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
                <span className="chip-crimson inline-flex items-center gap-1.5">
                  <Sparkles size={11} />
                  AI-Tutored Practice Engine
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={1}
                className="heading text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[58px]"
              >
                Study smarter.<br />
                <span className="text-crimson">Score higher.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={2}
                className="max-w-lg text-[15px] leading-relaxed text-black/55 dark:text-white/55"
              >
                Full-length diagnostic papers calibrated for NEET, JEE, and CBSE —
                graded by an AI tutoring system that writes your personal syllabus.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={3}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Link href="/signin" className="btn-primary">
                  Start Free Diagnostic <ArrowRight size={15} />
                </Link>
                <Link href="#how" className="btn-ghost">
                  See How It Works
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={4}
                className="flex flex-wrap items-center gap-5 pt-2"
              >
                {[
                  { value: 50, suffix: "Q", label: "Diagnostic paper" },
                  { value: 6, suffix: "", label: "Exam streams" },
                  { value: 720, suffix: "+", label: "Marks predicted" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <span className="heading text-xl font-extrabold text-ink dark:text-white">
                      <CountUp value={s.value} suffix={s.suffix} />
                    </span>
                    <span className="label text-[10px]">{s.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:flex justify-center"
            >
              <div className="relative w-full max-w-[520px]">
                {/* Card frame */}
                <div className="relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-3 dark:border-white/[0.07] dark:bg-[#141416]">
                  <Image
                    src="/illustrations/hero.png"
                    alt="Floating geometric study island"
                    width={520}
                    height={400}
                    className="w-full object-cover"
                    priority
                  />
                  {/* Subtle caption overlay */}
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white/80 to-transparent dark:from-[#141416]/80" />
                  <div className="absolute bottom-3 left-4">
                    <span className="chip-crimson text-[10px]">
                      <Sparkles size={9} /> AI-powered analysis
                    </span>
                  </div>
                </div>
                {/* Floating stat badge */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="absolute -right-4 top-8 rounded-xl border border-black/[0.07] bg-white px-3.5 py-2.5 shadow-2 dark:border-white/[0.07] dark:bg-[#1A1A1E]"
                >
                  <div className="text-[11px] font-medium text-black/50 dark:text-white/50">Mastery</div>
                  <div className="heading text-lg font-extrabold text-success">87%</div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -left-4 bottom-16 rounded-xl border border-black/[0.07] bg-white px-3.5 py-2.5 shadow-2 dark:border-white/[0.07] dark:bg-[#1A1A1E]"
                >
                  <div className="text-[11px] font-medium text-black/50 dark:text-white/50">Predicted Score</div>
                  <div className="heading text-lg font-extrabold text-crimson">620 / 720</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Subject ticker ──────────────────────────────────────── */}
      <section className="overflow-hidden border-y border-black/[0.06] py-4 dark:border-white/[0.06]">
        <div className="relative">
          <div className="flex w-max animate-marquee gap-2.5">
            {[...MARQUEE_SUBJECTS, ...MARQUEE_SUBJECTS].map((s, i) => (
              <span
                key={i}
                className="heading rounded-full border border-black/[0.08] px-4 py-1 text-[11px] text-black/45 dark:border-white/[0.08] dark:text-white/40"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-surface to-transparent dark:from-[#0D0D10]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-surface to-transparent dark:from-[#0D0D10]" />
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section id="how" className="py-20 sm:py-28">
        <div className="container-px">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: true }} custom={0}
            className="mb-12 space-y-2"
          >
            <span className="label text-crimson">Three steps</span>
            <h2 className="heading max-w-xl text-2xl font-extrabold tracking-tight sm:text-3xl">
              A structured path to mastery
            </h2>
          </motion.div>

          <div className="grid gap-px border border-black/[0.06] bg-black/[0.06] rounded-xl overflow-hidden sm:grid-cols-3 dark:border-white/[0.06] dark:bg-white/[0.06]">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="flex flex-col bg-surface p-8 dark:bg-[#0D0D10]"
              >
                <span className="label mb-6 text-black/25 dark:text-white/20">{s.step}</span>
                <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-crimson-soft text-crimson dark:bg-crimson/10 dark:text-crimson-light">
                  <s.icon size={18} />
                </span>
                <h3 className="heading text-[15px] font-bold text-ink dark:text-white">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-black/50 dark:text-white/50">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exam Streams ────────────────────────────────────────── */}
      <section id="streams" className="border-t border-black/[0.06] py-20 sm:py-28 dark:border-white/[0.06]">
        <div className="container-px">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: true }} custom={0}
            className="mb-12 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="space-y-2">
              <span className="label text-crimson">Syllabus streams</span>
              <h2 className="heading text-2xl font-extrabold tracking-tight sm:text-3xl">
                Calibrated for your exam
              </h2>
            </div>
            <p className="max-w-xs text-[13px] text-black/50 dark:text-white/50">
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
                className="group card flex flex-col justify-between p-6 transition-all hover:border-black/15 dark:hover:border-white/15"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="heading text-[15px] font-bold text-ink dark:text-white">{s.name}</h3>
                    <span
                      className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white"
                      style={{ background: s.accent }}
                    >
                      <Target size={13} />
                    </span>
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-black/50 dark:text-white/50 min-h-[40px]">
                    {s.tagline}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.subjects.map((sub) => (
                      <span key={sub} className="chip text-[10.5px]">{sub}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-black/[0.05] pt-4 dark:border-white/[0.05]">
                  <span className="font-mono text-[10px] font-semibold text-black/35 dark:text-white/35">
                    {s.difficultyMix.easy}% easy · {s.difficultyMix.medium}% med · {s.difficultyMix.hard}% hard
                  </span>
                  <Link href="/signin" className="inline-flex items-center gap-1 text-[12px] font-semibold text-crimson hover:underline">
                    Configure <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="border-t border-black/[0.06] bg-[#111112] py-20 text-white sm:py-28 dark:border-white/[0.06]">
        <div className="container-px">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: true }} custom={0}
            className="mb-12 space-y-2"
          >
            <span className="label !text-crimson-light">Features</span>
            <h2 className="heading max-w-lg text-2xl font-extrabold tracking-tight sm:text-3xl">
              Built for score climbs, not for show
            </h2>
          </motion.div>

          <div className="grid gap-px border border-white/[0.05] bg-white/[0.05] rounded-xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="group flex flex-col bg-[#111112] p-7 transition-colors hover:bg-white/[0.02]"
              >
                <span className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-crimson/10 text-crimson-light">
                  <f.icon size={16} />
                </span>
                <h3 className="heading text-[14.5px] font-semibold text-white/90">{f.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-white/50">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <section id="premium" className="py-20 sm:py-28">
        <div className="container-px">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: true }} custom={0}
            className="mb-12 space-y-2 text-center"
          >
            <span className="label text-crimson">Pricing</span>
            <h2 className="heading text-2xl font-extrabold tracking-tight sm:text-3xl">
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
                  <h3 className="heading text-[14px] font-bold text-ink/75 dark:text-white/75">Free Sandbox</h3>
                  <div className="heading mt-3 text-3xl font-extrabold text-ink dark:text-white">
                    ₹0 <span className="text-sm font-normal text-black/40 dark:text-white/40">/ forever</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-[12.5px] text-black/60 dark:text-white/60">
                  <li className="flex items-center gap-2"><Check size={12} className="text-success shrink-0" /> 2 mock tests per day</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-success shrink-0" /> Diagnostic test & report</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-success shrink-0" /> Basic stats dashboard</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-success shrink-0" /> Achievements profile</li>
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
              className="relative flex flex-col justify-between overflow-hidden rounded-card border border-crimson/25 bg-white p-7 shadow-2 dark:bg-[#141416]"
            >
              {/* Top crimson accent line */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-crimson" />
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="heading text-[14px] font-bold text-crimson">Premium Access</h3>
                    <span className="inline-flex items-center gap-1 rounded-md bg-crimson/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-crimson">
                      <Star size={8} fill="currentColor" /> Popular
                    </span>
                  </div>
                  <div className="heading mt-3 text-3xl font-extrabold text-ink dark:text-white">
                    ₹499 <span className="text-sm font-normal text-black/40 dark:text-white/40">/ month</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-[12.5px] text-black/65 dark:text-white/65">
                  <li className="flex items-center gap-2"><Check size={12} className="text-crimson shrink-0" /> <InfinityIcon size={11} /> Unlimited mock tests</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-crimson shrink-0" /> Personal AI coach tutor</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-crimson shrink-0" /> Heatmaps & score predictors</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-crimson shrink-0" /> Custom focus tests</li>
                </ul>
              </div>
              <Link href="/signin" className="btn-primary btn-sm mt-7 w-full">
                Go Premium
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="border-t border-black/[0.06] bg-[#111112] py-16 sm:py-24 dark:border-white/[0.06]">
        <div className="container-px">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="heading text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              50 Questions. One Tutor.<br />
              <span className="text-crimson">Zero Excuses.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[13.5px] leading-relaxed text-white/50">
              Your primary diagnostic evaluation starts immediately, takes 60 minutes, and outputs
              clear guidance the moment you submit.
            </p>
            <Link href="/signin" className="btn-primary mt-8 inline-flex">
              Take Free Diagnostic <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
