"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ClipboardList,
  Percent,
  Flame,
  Zap,
  ArrowRight,
  Plus,
  TrendingUp,
  Brain,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import PremiumBanner from "@/components/PremiumBanner";
import { PageHeader, Progress, EmptyState } from "@/components/ui";
import { getAnalytics } from "@/lib/api";
import { RequireAuth, useAuth } from "@/lib/auth";
import { formatDate, cn, normalizeMastery, formatMasteryPercent } from "@/lib/utils";
import { getMasteryColor, CHART_COLORS } from "@/lib/tokens";
import type { Analytics } from "@/lib/types";

function HeatmapGrid({ data }: { data: Analytics["heatmap"] }) {
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([subject, topics]) => (
        <div key={subject}>
          <div className="label mb-2 text-black/50 dark:text-white/45">{subject}</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(topics).map(([topic, acc]) => {
              const norm = normalizeMastery(acc);
              const pctStr = formatMasteryPercent(acc);
              return (
                <div key={topic} className="group relative">
                  <span
                    className="inline-flex h-8 min-w-[36px] px-1 items-center justify-center rounded-lg text-[10px] font-bold text-white transition-transform group-hover:scale-110 shadow-sm truncate"
                    style={{ background: getMasteryColor(norm) }}
                  >
                    {pctStr}%
                  </span>
                  <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 shadow-2 transition-opacity group-hover:opacity-100 dark:bg-neutral-800">
                    {topic}: {pctStr}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Analytics | null>(null);
  const stream = user?.stream ?? "neet";

  useEffect(() => {
    getAnalytics(user?.id ?? "", stream).then(setData);
  }, [user, stream]);

  const firstName = (user?.name ?? "Student").split(" ")[0];
  const nextLevelXp = data ? (data.level + 1) * 100 : 100;

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
            title={`Welcome back, ${firstName}`}
            subtitle={`${data?.streak ?? 0}-day study streak. Keep the momentum going.`}
            actions={
              <Link href="/mock-test" className="btn-primary">
                <Plus size={16} /> Attempt Mock Test
              </Link>
            }
          />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Tests attempted" value={data?.attempts ?? 0} icon={ClipboardList} accent={CHART_COLORS.primary} sub="lifetime" />
            <StatCard label="Average score" value={data?.avg_score ?? 0} decimals={1} suffix="%" icon={Percent} accent={CHART_COLORS.secondary} sub="all attempts" />
            <StatCard label="Streak" value={data?.streak ?? 0} suffix=" days" icon={Flame} accent={CHART_COLORS.warning} sub="daily practice" />
            <StatCard label="Level" value={data?.level ?? 1} icon={Zap} accent={CHART_COLORS.tertiary} sub={`${data?.xp ?? 0} XP · ${nextLevelXp} to next`} />
          </div>

          <div>
            <PremiumBanner dailyUsed={1} dailyLimit={2} />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <ChartCard
              title="Score trend"
              subtitle="Last 20 days of attempts"
              icon={TrendingUp}
              accent={CHART_COLORS.primary}
            >
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.trend ?? []} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.15} />
                        <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.06} vertical={false} />
                    <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.4 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.4 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip
                      formatter={(v) => [`${String(v)}%`, "Score"]}
                      labelFormatter={(l) => formatDate(String(l))}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid rgba(0,0,0,0.05)",
                        background: "var(--color-surface)",
                        fontSize: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="score" stroke={CHART_COLORS.primary} strokeWidth={2} fill="url(#scoreFill)" dot={{ r: 3, fill: CHART_COLORS.primary }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Mastery heatmap" subtitle="Topic accuracy, per subject" icon={Brain} accent={CHART_COLORS.success}>
              <div className="mt-4">
                <HeatmapGrid data={data?.heatmap ?? {}} />
              </div>
            </ChartCard>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <ChartCard title="Recent attempts" subtitle="Your last 5 tests" icon={ClipboardList} accent={CHART_COLORS.primary}>
              <div className="space-y-3 mt-4">
                {(data?.recent_attempts ?? []).map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                    className="flex items-center gap-3 rounded-lg border border-black/5 bg-white/50 p-3.5 dark:border-white/5 dark:bg-white/[0.02] shadow-sm hover:border-black/10 dark:hover:border-white/10 transition-colors"
                  >
                    <span
                      className={cn(
                        "inline-flex h-10 w-12 shrink-0 items-center justify-center rounded-md text-xs font-bold shadow-sm",
                        a.accuracy >= 0.8
                          ? "bg-success/10 text-success"
                          : a.accuracy >= 0.6
                            ? "bg-crimson/10 text-crimson"
                            : "bg-warning/10 text-warning-dark",
                      )}
                    >
                      {a.score}/{a.total}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{a.title}</div>
                      <div className="text-[11px] text-black/45 dark:text-white/45">
                        {formatDate(a.date)} · {Math.round(a.accuracy * 100)}% accuracy
                      </div>
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-black/20 dark:text-white/20" />
                  </motion.div>
                ))}
                {(data?.recent_attempts ?? []).length === 0 && (
                  <EmptyState
                    title="No attempts yet"
                    description="Take your first mock test to see your recent attempts here."
                    action={{ label: "Attempt Mock Test", href: "/mock-test" }}
                  />
                )}
              </div>
            </ChartCard>

            <ChartCard title="XP progress" subtitle={`Level ${data?.level ?? 1} · next level at ${nextLevelXp} XP`} icon={Zap} accent={CHART_COLORS.tertiary}>
              <div className="flex h-64 flex-col justify-between mt-4">
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.trend.slice(-7).map((p) => ({ ...p, xp: (data?.xp ?? 0) / 7 })) ?? []}>
                      <Area type="monotone" dataKey="xp" stroke={CHART_COLORS.tertiary} fill="rgba(139,92,246,0.06)" strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-black/50 dark:text-white/40">
                    <span>{data?.xp ?? 0} XP earned</span>
                    <span>{nextLevelXp} XP</span>
                  </div>
                  <Progress value={data?.xp ?? 0} max={nextLevelXp} size="sm" />
                  <p className="mt-3 text-xs leading-relaxed text-black/50 dark:text-white/50">
                    {data?.streak ?? 0}-day streak! Complete 2 more days to unlock the{" "}
                    <span className="font-bold text-crimson">Unstoppable</span> badge.
                  </p>
                </div>
              </div>
            </ChartCard>
          </div>
        </motion.div>
      </AppShell>
    </RequireAuth>
  );
}
