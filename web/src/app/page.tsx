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
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountUp from "@/components/CountUp";
import { MOCK_STREAMS } from "@/lib/mock-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] },
  }),
};

const STEPS = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Take a 50-question diagnostic",
    body: "A timed mock test tuned to your stream — NEET, JEE or CBSE. Answer naturally; the AI maps your exact strengths and gaps.",
  },
  {
    icon: BrainCircuit,
    step: "02",
    title: "Get an AI coach readout",
    body: "Topic-level accuracy, weak and strong areas, percentile estimate and a personal coaching message written by the AI.",
  },
  {
    icon: Gauge,
    step: "03",
    title: "Practice with a personal study plan",
    body: "Auto-generated focus tests target your weak topics. Retake mocks, watch your mastery heatmap turn crimson-to-green.",
  },
];

const FEATURES = [
  {
    icon: Bot,
    title: "AI coach after every test",
    body: "A human-style coaching message explains exactly what to fix — and why — after every submission.",
  },
  {
    icon: Gauge,
    title: "Predictor & percentile",
    body: "Projected exam score and estimated percentile keep your goal honest and trackable.",
  },
  {
    icon: BrainCircuit,
    title: "Mastery heatmap",
    body: "Every topic colour-coded from crimson (weak) to green (mastered). See progress at a glance.",
  },
  {
    icon: Target,
    title: "Weak-topic focus tests",
    body: "One tap generates a mock test built entirely around the topics where you bleed marks.",
  },
  {
    icon: Zap,
    title: "Streaks & XP",
    body: "Gamified daily streaks, XP levels and badges keep you coming back every single day.",
  },
  {
    icon: Trophy,
    title: "All the right exams",
    body: "NEET, JEE Mains, JEE Advanced and CBSE classes 10–12 — question style and difficulty matched per stream.",
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
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-44">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-crimson opacity-[0.14] blur-[120px]" />
        <div className="pointer-events-none absolute right-[-160px] top-40 h-[380px] w-[380px] rounded-full bg-crimson-light opacity-[0.12] blur-[100px]" />

        <div className="container-px relative text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="chip mx-auto border-crimson/30 bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light">
              <Sparkles size={13} /> AI-tutored mock tests · Hackathon build
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="heading mx-auto mt-6 max-w-4xl text-5xl leading-[0.98] sm:text-7xl lg:text-[88px]"
          >
            Practice like the exam{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-crimson to-crimson-light bg-clip-text text-transparent">
                is real.
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
                className="absolute -bottom-2 left-0 h-2 w-full origin-left rounded-pill bg-crimson/30 blur-sm"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-black/60 sm:text-lg dark:text-white/60"
          >
            Mock tests for NEET, JEE Mains, JEE Advanced and CBSE 10–12 — graded by an
            AI coach that tells you what to fix, topic by topic.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/signin" className="btn-primary w-full px-8 py-4 text-base sm:w-auto">
              Start free diagnostic <ArrowRight size={18} />
            </Link>
            <Link href="#how" className="btn-ghost w-full px-8 py-4 text-base sm:w-auto">
              <Play size={16} /> See how it works
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {[
              { value: 50, suffix: "Q", label: "per diagnostic" },
              { value: 6, suffix: "", label: "exam streams" },
              { value: 720, suffix: "+", label: "marks predicted" },
              { value: 12, suffix: "", label: "subjects mapped" },
            ].map((s) => (
              <div key={s.label} className="card px-4 py-5">
                <div className="heading text-3xl text-crimson sm:text-4xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </div>
                <div className="label mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="how" className="py-20 sm:py-28">
        <div className="container-px">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} className="text-center">
            <span className="label text-crimson">How it works</span>
            <h2 className="heading mt-3 text-3xl sm:text-5xl">Three steps to mastery</h2>
          </motion.div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                className="card group relative overflow-hidden p-7 transition-shadow hover:shadow-soft"
              >
                <div className="heading absolute right-5 top-4 text-5xl text-black/[0.05] dark:text-white/[0.06]">
                  {s.step}
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lgx bg-crimson text-white shadow-glow transition-transform group-hover:scale-110">
                  <s.icon size={22} />
                </span>
                <h3 className="heading mt-5 text-lg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/55 dark:text-white/55">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="streams" className="py-20 sm:py-24">
        <div className="container-px">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} className="text-center">
            <span className="label text-crimson">Exam streams</span>
            <h2 className="heading mt-3 text-3xl sm:text-5xl">Pick your battlefield</h2>
          </motion.div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_STREAMS.map((s, i) => (
              <motion.div
                key={s.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="card group relative overflow-hidden p-6 transition-all hover:-translate-y-1.5 hover:shadow-soft"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-[0.12] blur-2xl transition-opacity group-hover:opacity-25"
                  style={{ background: s.accent }}
                />
                <div className="flex items-center justify-between">
                  <h3 className="heading text-xl">{s.name}</h3>
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lgx text-white"
                    style={{ background: s.accent, boxShadow: `0 10px 28px ${s.accent}55` }}
                  >
                    <Target size={18} />
                  </span>
                </div>
                <p className="mt-2 min-h-10 text-sm text-black/55 dark:text-white/55">{s.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.subjects.map((sub) => (
                    <span key={sub} className="chip text-[11px]">
                      {sub}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-black/45 dark:text-white/45">
                    {s.difficultyMix.easy}% easy · {s.difficultyMix.medium}% medium · {s.difficultyMix.hard}% hard
                  </span>
                  <Link
                    href="/signin"
                    className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-crimson transition-transform hover:translate-x-0.5"
                  >
                    Practice <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-ink py-20 text-white sm:py-28">
        <div className="container-px">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} className="text-center">
            <span className="label !text-crimson-light">Features</span>
            <h2 className="heading mt-3 text-3xl sm:text-5xl">Everything a serious student needs</h2>
          </motion.div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                className="group rounded-card border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-colors hover:border-crimson/60"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lgx bg-crimson text-white shadow-glow transition-transform group-hover:rotate-6">
                  <f.icon size={20} />
                </span>
                <h3 className="heading mt-4 text-lg">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="premium" className="py-20 sm:py-24">
        <div className="container-px">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} className="text-center">
            <span className="label text-crimson">Premium</span>
            <h2 className="heading mt-3 text-3xl sm:text-5xl">Start free. Go unlimited.</h2>
          </motion.div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1} className="card p-7">
              <h3 className="heading text-lg">Free</h3>
              <div className="heading mt-3 text-4xl">
                ₹0 <span className="text-sm font-medium text-black/45 dark:text-white/45">/ forever</span>
              </div>
              <ul className="mt-5 space-y-2.5 text-sm text-black/60 dark:text-white/60">
                <li>2 mock tests per day</li>
                <li>Diagnostic test & report</li>
                <li>Basic analytics</li>
                <li>Community leaderboard</li>
              </ul>
              <Link href="/signin" className="btn-ghost mt-6 w-full">
                Start free
              </Link>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={2}
              className="relative overflow-hidden rounded-card bg-gradient-to-br from-crimson to-crimson-deep p-7 text-white shadow-glow-lg"
            >
              <div className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
              <span className="inline-flex items-center gap-1 rounded-pill bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                <Star size={11} fill="currentColor" /> Popular
              </span>
              <h3 className="heading mt-3 text-lg">Premium</h3>
              <div className="heading mt-3 text-4xl">
                ₹499 <span className="text-sm font-medium text-white/60">/ month</span>
              </div>
              <ul className="mt-5 space-y-2.5 text-sm text-white/85">
                <li className="flex gap-2"><InfinityIcon size={15} className="shrink-0" /> Unlimited AI mock tests</li>
                <li className="flex gap-2"><Bot size={15} className="shrink-0" /> Personal AI coach</li>
                <li className="flex gap-2"><Gauge size={15} className="shrink-0" /> Full analytics + predictor</li>
                <li className="flex gap-2"><Target size={15} className="shrink-0" /> Focus tests on weak topics</li>
              </ul>
              <Link href="/signin" className="btn mt-6 w-full bg-white text-crimson-deep hover:bg-white/90">
                Go Premium
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden py-14">
        <div className="relative">
          <div className="flex w-max animate-marquee gap-4">
            {[...MARQUEE_SUBJECTS, ...MARQUEE_SUBJECTS].map((s, i) => (
              <span
                key={i}
                className="heading rounded-pill border border-black/10 px-5 py-2 text-sm text-black/60 dark:border-white/15 dark:text-white/60"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent dark:from-[#0b0b0f]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent dark:from-[#0b0b0f]" />
        </div>
      </section>

      <section className="pb-24 pt-10">
        <div className="container-px">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-card bg-ink px-6 py-14 text-center text-white sm:px-12 sm:py-20"
          >
            <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-crimson opacity-25 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-crimson-deep opacity-30 blur-[100px]" />
            <h2 className="heading relative text-3xl sm:text-5xl">
              50 questions. One coach. <span className="text-crimson-light">Zero excuses.</span>
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm text-white/60 sm:text-base">
              Your diagnostic is free, takes 60 minutes, and your AI coach starts coaching
              the moment you hit submit.
            </p>
            <Link href="/signin" className="btn-primary relative mt-8 px-9 py-4 text-base">
              Take the free diagnostic <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
