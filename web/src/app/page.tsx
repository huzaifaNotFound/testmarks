"use client";

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
  Play,
  Check,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountUp from "@/components/CountUp";
import { MOCK_STREAMS } from "@/lib/mock-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
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
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Organic Chemistry",
  "Genetics",
  "Electrostatics",
  "Calculus",
  "Thermodynamics",
  "Human Physiology",
  "Coordinate Geometry",
  "Cell Biology",
  "Kinematics",
  "Probability",
  "Modern Physics",
  "Algebra",
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-surface dark:bg-ink">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-44">
        {/* Subtle grid background texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)]" />
        
        {/* Calm background ambient gradient */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-crimson opacity-[0.06] blur-[100px]" />

        <div className="container-px relative text-center space-y-6">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="chip mx-auto border-crimson/25 bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light">
              <Sparkles size={12} /> AI-Tutored Practice Engine
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="heading mx-auto max-w-4xl text-4xl leading-[1.05] sm:text-6xl lg:text-[76px] font-extrabold tracking-tight"
          >
            Practice like the exam <br/>
            <span className="bg-gradient-to-r from-crimson to-crimson-light bg-clip-text text-transparent">
              is happening now.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mx-auto max-w-2xl text-sm leading-relaxed text-black/60 sm:text-base dark:text-white/60"
          >
            Full-length diagnostic papers calibrated for NEET, JEE, and CBSE — graded by an
            AI tutoring system that writes your personal syllabus.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/signin" className="btn-primary w-full px-8 py-3.5 text-sm sm:w-auto">
              Start Free Diagnostic <ArrowRight size={16} />
            </Link>
            <Link href="#how" className="btn-ghost w-full px-8 py-3.5 text-sm sm:w-auto">
              <Play size={14} /> See How It Works
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 pt-4"
          >
            {[
              { value: 50, suffix: "Q", label: "Diagnostic paper" },
              { value: 6, suffix: "", label: "Exam streams" },
              { value: 720, suffix: "+", label: "Predicted marks" },
              { value: 12, suffix: "", label: "Subjects mapped" },
            ].map((s) => (
              <div key={s.label} className="card p-5 bg-white dark:bg-white/[0.01] border-black/5 dark:border-white/10 shadow-sm">
                <div className="heading text-3xl font-extrabold text-crimson">
                  <CountUp value={s.value} suffix={s.suffix} />
                </div>
                <div className="label mt-1 text-[10px] text-black/50 dark:text-white/40">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 sm:py-24 border-t border-black/5 dark:border-white/5 bg-white/[0.01] dark:bg-transparent">
        <div className="container-px">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} className="text-center space-y-2">
            <span className="label text-crimson">Three Steps</span>
            <h2 className="heading text-2xl sm:text-4xl font-extrabold tracking-tight">Structured Path to Mastery</h2>
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="card p-7 bg-white dark:bg-white/[0.01] border-black/5 dark:border-white/10 relative hover:border-black/15 dark:hover:border-white/20 transition-all flex flex-col items-start"
              >
                <div className="heading absolute right-5 top-4 text-5xl font-extrabold text-black/[0.03] dark:text-white/[0.02] select-none">
                  {s.step}
                </div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-crimson-soft text-crimson dark:bg-crimson/10 dark:text-crimson-light mb-5">
                  <s.icon size={20} />
                </span>
                <h3 className="heading text-base font-bold text-black/80 dark:text-white/80">{s.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-black/55 dark:text-white/55">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Streams */}
      <section id="streams" className="py-20 sm:py-24 border-t border-black/5 dark:border-white/5">
        <div className="container-px">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} className="text-center space-y-2">
            <span className="label text-crimson">Syllabus streams</span>
            <h2 className="heading text-2xl sm:text-4xl font-extrabold tracking-tight">Calibrated Exam Matrices</h2>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_STREAMS.map((s, i) => (
              <motion.div
                key={s.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="card p-6 bg-white dark:bg-white/[0.01] border-black/5 dark:border-white/10 flex flex-col justify-between hover:border-black/15 dark:hover:border-white/25 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="heading text-lg font-bold text-black/80 dark:text-white/80">{s.name}</h3>
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white"
                      style={{ background: s.accent }}
                    >
                      <Target size={16} />
                    </span>
                  </div>
                  <p className="text-xs text-black/55 dark:text-white/55 leading-relaxed min-h-10">{s.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {s.subjects.map((sub) => (
                      <span key={sub} className="chip text-[10px] bg-black/[0.01] dark:bg-white/[0.01]">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-4">
                  <span className="text-[10px] font-semibold text-black/45 dark:text-white/40 font-mono">
                    {s.difficultyMix.easy}% easy · {s.difficultyMix.medium}% med · {s.difficultyMix.hard}% hard
                  </span>
                  <Link
                    href="/signin"
                    className="inline-flex items-center gap-1 text-xs font-bold text-crimson hover:underline"
                  >
                    Configure <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-ink py-20 text-white sm:py-24 relative overflow-hidden">
        {/* Subtle grid background texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)]" />
        
        <div className="container-px relative space-y-12">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} className="text-center space-y-2">
            <span className="label !text-crimson-light">Features</span>
            <h2 className="heading text-2xl sm:text-4xl font-extrabold tracking-tight">Structured for High Score Climbs</h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="group rounded-2xl border border-white/5 bg-white/[0.01] p-6 hover:border-crimson/40 transition-colors flex flex-col items-start"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-crimson text-white shadow-sm mb-4">
                  <f.icon size={18} />
                </span>
                <h3 className="heading text-base font-bold text-white/90">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/60">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Options */}
      <section id="premium" className="py-20 sm:py-24 border-b border-black/5 dark:border-white/5 bg-white/[0.01] dark:bg-transparent">
        <div className="container-px">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} className="text-center space-y-2">
            <span className="label text-crimson">Pricing</span>
            <h2 className="heading text-2xl sm:text-4xl font-extrabold tracking-tight">Calm Pricing plans</h2>
          </motion.div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1} className="card p-7 bg-white dark:bg-white/[0.01] border-black/5 dark:border-white/10 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="heading text-base font-bold text-black/70 dark:text-white/70">Free Sandbox</h3>
                <div className="heading text-4xl font-extrabold text-black/80 dark:text-white/80">
                  ₹0 <span className="text-sm font-medium text-black/45 dark:text-white/45">/ forever</span>
                </div>
                <ul className="space-y-2.5 text-xs text-black/60 dark:text-white/60 pt-2">
                  <li className="flex items-center gap-2"><Check size={12} className="text-success" /> 2 mock tests per day</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-success" /> Diagnostic test & report</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-success" /> Basic stats dashboard</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-success" /> Achievements profile</li>
                </ul>
              </div>
              <Link href="/signin" className="btn-ghost btn-sm mt-6 w-full py-3.5">
                Start Free
              </Link>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={2}
              className="card p-7 bg-white dark:bg-white/[0.01] border-crimson/20 dark:border-crimson/30 relative flex flex-col justify-between ring-1 ring-crimson/10 shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="heading text-base font-bold text-crimson">Premium Access</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-crimson/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-crimson">
                    <Star size={9} fill="currentColor" /> POPULAR
                  </span>
                </div>
                <div className="heading text-4xl font-extrabold text-black/80 dark:text-white/80">
                  ₹499 <span className="text-sm font-medium text-black/45 dark:text-white/45">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-black/70 dark:text-white/70 pt-2">
                  <li className="flex items-center gap-2"><Check size={12} className="text-crimson" /> <InfinityIcon size={12} /> Unlimited mock tests</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-crimson" /> Personal AI coach tutor</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-crimson" /> Heatmaps & score predictors</li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-crimson" /> Custom focus tests</li>
                </ul>
              </div>
              <Link href="/signin" className="btn-primary btn-sm mt-6 w-full py-3.5">
                Go Premium
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <section className="overflow-hidden py-10 border-b border-black/5 dark:border-white/5">
        <div className="relative">
          <div className="flex w-max animate-marquee gap-3">
            {[...MARQUEE_SUBJECTS, ...MARQUEE_SUBJECTS].map((s, i) => (
              <span
                key={i}
                className="heading rounded-full border border-black/10 px-4.5 py-1.5 text-xs text-black/50 dark:border-white/10 dark:text-white/45"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent dark:from-ink" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent dark:from-ink" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container-px">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] px-6 py-12 text-center text-ink dark:text-white sm:px-12 sm:py-16"
          >
            <h2 className="heading text-2xl sm:text-4xl font-extrabold tracking-tight">
              50 Questions. One Tutor. <span className="text-crimson">Zero Excuses.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs text-black/50 sm:text-sm dark:text-white/50 leading-relaxed">
              Your primary diagnostic evaluation starts immediately, takes 60 minutes, and outputs clear guidance the moment you submit.
            </p>
            <Link href="/signin" className="btn-primary relative mt-6 px-8 py-3.5 text-sm">
              Take Free Diagnostic <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
