"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  LineChart as LineChartIcon,
  Grid3X3,
  Gauge,
  Trophy,
  BrainCircuit,
} from "lucide-react";
import {
  Line as ReLine,
  LineChart as ReLineChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar as ReRadar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import AppShell from "@/components/AppShell";
import ChartCard from "@/components/ChartCard";
import Badge from "@/components/Badge";
import CountUp from "@/components/CountUp";
import { getAnalytics } from "@/lib/api";
import { RequireAuth, useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { Analytics } from "@/lib/types";

import {
  Zap,
  Flame,
  Target,
  Brain,
  Rocket,
  Crown,
  Star,
} from "lucide-react";

const LUCIDE: Record<string, typeof Zap> = { Zap, Flame, Trophy, Target, Brain, Rocket, Crown, Star };

function PredictorGauge({ expected, max }: { expected: number; max: number }) {
  const pct = Math.min(1, expected / max);
  const angle = -90 + pct * 180;
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="260" height="150" viewBox="0 0 260 150">
          <path
            d="M 20 140 A 110 110 0 0 1 240 140"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            className="text-black/[0.07] dark:text-white/10"
          />
          <motion.path
            d="M 20 140 A 110 110 0 0 1 240 140"
            fill="none"
            stroke="#DC143C"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={Math.PI * 110}
            initial={{ strokeDashoffset: Math.PI * 110 }}
            animate={{ strokeDashoffset: Math.PI * 110 * (1 - pct) }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: "drop-shadow(0 0 10px rgba(220,20,60,0.5))" }}
          />
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: angle }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "130px 140px" }}
          >
            <line x1="130" y1="140" x2="130" y2="52" stroke="#0B0B0F" strokeWidth="3" strokeLinecap="round" className="dark:stroke-white" />
            <circle cx="130" cy="140" r="7" fill="#DC143C" />
          </motion.g>
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <div className="heading text-4xl text-crimson">
            <CountUp value={expected} suffix={`/${max}`} />
          </div>
          <div className="label">Projected score</div>
        </div>
      </div>
      <div className="mt-2 flex w-full max-w-xs justify-between text-[10px] font-semibold text-black/35 dark:text-white/35">
        <span>0</span>
        <span>Current trend</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Analytics | null>(null);
  const stream = user?.stream ?? "neet";

  useEffect(() => {
    getAnalytics(user?.id ?? "", stream).then(setData);
  }, [user, stream]);

  const heatData = data ? Object.values(data.heatmap).flatMap((topics) => Object.entries(topics)) : [];

  return (
    <RequireAuth>
      <AppShell>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="heading text-2xl sm:text-3xl">Analytics Hub</h1>
            <p className="mt-1 text-sm text-black/50 dark:text-white/50">
              Your brain, mapped. Predictor, mastery and momentum.
            </p>
          </div>
          <span className="chip border-crimson/30 bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light">
            <BrainCircuit size={13} /> {data?.attempts ?? 0} attempts analysed
          </span>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <ChartCard title="Brain map" subtitle="12-subject mastery radar" icon={Radar} className="lg:col-span-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data?.brain_map ?? []} outerRadius="72%">
                  <PolarGrid stroke="currentColor" opacity={0.15} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} />
                  <ReRadar
                    dataKey="value"
                    stroke="#DC143C"
                    strokeWidth={2}
                    fill="#DC143C"
                    fillOpacity={0.3}
                    dot={{ r: 3, fill: "#DC143C", strokeWidth: 0 }}
                  />
                  <Tooltip formatter={(v) => [`${Math.round(Number(v) * 100)}%`, "Mastery"]} contentStyle={{ borderRadius: 12, fontSize: 12, background: "var(--color-surface)", border: "1px solid rgba(0,0,0,0.08)" }} />                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Score predictor" subtitle="Linear projection from trend" icon={Gauge} accent="#F59E0B">
            {data && <PredictorGauge expected={data.predictor.expected} max={data.predictor.max} />}
          </ChartCard>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_380px]">
          <ChartCard title="Performance trend" subtitle="Score % over time" icon={LineChartIcon}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={data?.trend ?? []} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [`${String(v)}%`, "Score"]} labelFormatter={(l) => formatDate(String(l))} contentStyle={{ borderRadius: 12, fontSize: 12, background: "var(--color-surface)", border: "1px solid rgba(0,0,0,0.08)" }} />
                  <ReLine name="score" dataKey="score" type="monotone" stroke="#DC143C" strokeWidth={2.5} dot={{ r: 3, fill: "#DC143C" }} activeDot={{ r: 6 }} />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Mastery heatmap" subtitle={`${heatData.length} topics tracked`} icon={Grid3X3} accent="#10B981">
            <div className="grid grid-cols-7 gap-1.5">
              {heatData.map(([topic, v]) => (
                <div key={topic} className="group relative">
                  <span
                    className="flex h-9 w-full items-center justify-center rounded-lgx text-[9px] font-bold text-white transition-transform group-hover:scale-110"
                    style={{
                      background:
                        v >= 0.8 ? "#16A34A" : v >= 0.6 ? "#65A30D" : v >= 0.4 ? "#F59E0B" : "#DC143C",
                    }}
                  >
                    {Math.round(v * 100)}
                  </span>
                  <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lgx bg-ink px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
                    {topic}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Badges & achievements" subtitle={`${data?.badges.filter((b) => b.earned).length ?? 0} of ${data?.badges.length ?? 0} unlocked`} icon={Trophy} accent="#F59E0B" className="mt-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9">
            {(data?.badges ?? []).map((b, i) => (
              <Badge
                key={b.id}
                name={b.name}
                description={b.description}
                icon={LUCIDE[b.icon] ?? Zap}
                earned={b.earned}
                delay={0.04 * i}
              />
            ))}
          </div>
        </ChartCard>
      </motion.div>
      </AppShell>
    </RequireAuth>
  );
}
