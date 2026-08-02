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
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import AppShell from "@/components/AppShell";
import ChartCard from "@/components/ChartCard";
import Badge from "@/components/Badge";
import CountUp from "@/components/CountUp";
import { PageHeader } from "@/components/ui";
import { getAnalytics } from "@/lib/api";
import { RequireAuth, useAuth } from "@/lib/auth";
import { formatDate, normalizeMastery, formatMasteryPercent } from "@/lib/utils";
import { getMasteryColor, CHART_COLORS } from "@/lib/tokens";
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
      <div className="relative mt-4">
        <svg width="260" height="150" viewBox="0 0 260 150">
          <path
            d="M 20 140 A 110 110 0 0 1 240 140"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            className="text-black/[0.05] dark:text-white/10"
          />
          <motion.path
            d="M 20 140 A 110 110 0 0 1 240 140"
            fill="none"
            stroke={CHART_COLORS.primary}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={Math.PI * 110}
            initial={{ strokeDashoffset: Math.PI * 110 }}
            animate={{ strokeDashoffset: Math.PI * 110 * (1 - pct) }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: angle }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ transformOrigin: "130px 140px" }}
          >
            <line x1="130" y1="140" x2="130" y2="52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-ink dark:text-white" />
            <circle cx="130" cy="140" r="5" fill={CHART_COLORS.primary} />
          </motion.g>
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <div className="heading text-4xl text-crimson">
            <CountUp value={expected} suffix={`/${max}`} />
          </div>
          <div className="label mt-1 text-black/50 dark:text-white/45">Projected score</div>
        </div>
      </div>
      <div className="mt-3 flex w-full max-w-xs justify-between text-[10px] font-semibold text-black/35 dark:text-white/35">
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
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="space-y-6"
        >
          <PageHeader
            title="Analytics Hub"
            subtitle="Deep skill mapping, predictor models and momentum."
            actions={
              <span className="chip border-crimson/25 bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light">
                <BrainCircuit size={13} /> {data?.attempts ?? 0} attempts analysed
              </span>
            }
          />

          <div className="grid gap-5 lg:grid-cols-3">
            <ChartCard title="Brain map" subtitle="12-subject mastery radar" icon={Radar} className="lg:col-span-2" accent={CHART_COLORS.primary}>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={(data?.brain_map ?? []).map((b) => ({ ...b, value: normalizeMastery(b.value) }))} outerRadius="72%">
                    <PolarGrid stroke="currentColor" opacity={0.08} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }} />
                    <ReRadar
                      dataKey="value"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={1.5}
                      fill={CHART_COLORS.primary}
                      fillOpacity={0.15}
                      dot={{ r: 3, fill: CHART_COLORS.primary, strokeWidth: 0 }}
                    />
                    <RechartsTooltip formatter={(v) => [`${formatMasteryPercent(Number(v))}%`, "Mastery"]} contentStyle={{ borderRadius: 8, fontSize: 12, background: "var(--color-surface)", border: "1px solid rgba(0,0,0,0.05)" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Score predictor" subtitle="Linear projection from trend" icon={Gauge} accent={CHART_COLORS.warning}>
              <PredictorGauge expected={data?.predictor.expected ?? 0} max={data?.predictor.max ?? 720} />
            </ChartCard>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
            <ChartCard title="Performance trend" subtitle="Score % over time" icon={LineChartIcon} accent={CHART_COLORS.primary}>
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={data?.trend ?? []} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.06} vertical={false} />
                    <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.4 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.4 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip formatter={(v) => [`${String(v)}%`, "Score"]} labelFormatter={(l) => formatDate(String(l))} contentStyle={{ borderRadius: 8, fontSize: 12, background: "var(--color-surface)", border: "1px solid rgba(0,0,0,0.05)" }} />
                    <ReLine name="score" dataKey="score" type="monotone" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ r: 3, fill: CHART_COLORS.primary }} activeDot={{ r: 5 }} />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Mastery heatmap" subtitle={`${heatData.length} topics tracked`} icon={Grid3X3} accent={CHART_COLORS.success}>
              <div className="grid grid-cols-7 gap-1.5 mt-4">
                {heatData.map(([topic, v]) => {
                  const norm = normalizeMastery(v);
                  const pctStr = formatMasteryPercent(v);
                  return (
                    <div key={topic} className="group relative">
                      <span
                        className="flex h-9 w-full min-w-0 px-0.5 items-center justify-center rounded-md text-[9px] font-bold text-white transition-transform group-hover:scale-110 shadow-sm truncate"
                        style={{
                          background: getMasteryColor(norm),
                        }}
                      >
                        {pctStr}%
                      </span>
                      <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-2 transition-opacity group-hover:opacity-100 dark:bg-neutral-800">
                        {topic}: {pctStr}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>

          <ChartCard title="Badges & achievements" subtitle={`${data?.badges.filter((b) => b.earned).length ?? 0} of ${data?.badges.length ?? 0} unlocked`} icon={Trophy} accent={CHART_COLORS.warning}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 mt-4">
              {(data?.badges ?? []).map((b, i) => (
                <Badge
                  key={b.id}
                  name={b.name}
                  description={b.description}
                  icon={LUCIDE[b.icon] ?? Zap}
                  earned={b.earned}
                  delay={0.02 * i}
                />
              ))}
            </div>
          </ChartCard>
        </motion.div>
      </AppShell>
    </RequireAuth>
  );
}
