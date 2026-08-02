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
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import PremiumBanner from "@/components/PremiumBanner";
import { getAnalytics } from "@/lib/api";
import { RequireAuth, useAuth } from "@/lib/auth";
import { formatDate, cn } from "@/lib/utils";
import type { Analytics } from "@/lib/types";

const HEAT_COLOR = (v: number) => {
  if (v >= 0.8) return "#16A34A";
  if (v >= 0.6) return "#65A30D";
  if (v >= 0.4) return "#F59E0B";
  if (v >= 0.2) return "#F97316";
  return "#DC143C";
};

function HeatmapGrid({ data }: { data: Analytics["heatmap"] }) {
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([subject, topics]) => (
        <div key={subject}>
          <div className="label mb-2">{subject}</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(topics).map(([topic, acc]) => (
              <div key={topic} className="group relative">
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lgx text-[10px] font-bold text-white transition-transform group-hover:scale-110"
                  style={{ background: HEAT_COLOR(acc) }}
                >
                  {Math.round(acc * 100)}
                </span>
                <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lgx bg-ink px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
                  {topic}
                </span>
              </div>
            ))}
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
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="heading text-2xl sm:text-3xl">
                Good to see you, <span className="text-crimson">{firstName}</span> 👋
              </h1>
              <p className="mt-1 text-sm text-black/50 dark:text-white/50">
                {data?.streak ?? 0}-day streak. Keep the flame alive.
              </p>
            </div>
            <Link href="/mock-test" className="btn-primary">
              <Plus size={16} /> Attempt Mock Test
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Tests attempted" value={data?.attempts ?? 0} icon={ClipboardList} accent="#DC143C" sub="lifetime" />
            <StatCard label="Average score" value={data?.avg_score ?? 0} decimals={1} suffix="%" icon={Percent} accent="#0EA5E9" sub="all attempts" />
            <StatCard label="Streak" value={data?.streak ?? 0} suffix=" days" icon={Flame} accent="#F59E0B" sub="daily practice" />
            <StatCard label="Level" value={data?.level ?? 1} icon={Zap} accent="#8B5CF6" sub={`${data?.xp ?? 0} XP · ${nextLevelXp} to next`} />
          </div>

          <div className="mt-6">
            <PremiumBanner dailyUsed={1} dailyLimit={2} />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
            <ChartCard
              title="Score trend"
              subtitle="Last 20 days of attempts"
              icon={TrendingUp}
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.trend ?? []} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#DC143C" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#DC143C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
                    <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(v) => [`${String(v)}%`, "Score"]}
                      labelFormatter={(l) => formatDate(String(l))}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid rgba(0,0,0,0.08)",
                        background: "var(--color-surface)",
                        fontSize: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#DC143C" strokeWidth={2.5} fill="url(#scoreFill)" dot={{ r: 3, fill: "#DC143C" }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Mastery heatmap" subtitle="Topic accuracy, per subject" icon={Brain} accent="#10B981">
              <HeatmapGrid data={data?.heatmap ?? {}} />
            </ChartCard>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
            <ChartCard title="Recent attempts" subtitle="Your last 5 tests" icon={ClipboardList}>
              <div className="space-y-2.5">
                {(data?.recent_attempts ?? []).map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-center gap-3 rounded-lgx border border-black/5 p-3 dark:border-white/10"
                  >
                    <span
                      className={cn(
                        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lgx text-xs font-bold",
                        a.accuracy >= 0.8
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : a.accuracy >= 0.6
                            ? "bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400",
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
                    <ArrowRight size={14} className="shrink-0 text-black/25 dark:text-white/25" />
                  </motion.div>
                ))}
                {(data?.recent_attempts ?? []).length === 0 && (
                  <p className="py-6 text-center text-sm text-black/45 dark:text-white/45">
                    No attempts yet — take your first mock test!
                  </p>
                )}
              </div>
            </ChartCard>

            <ChartCard title="XP progress" subtitle={`Level ${data?.level ?? 1} · next level at ${nextLevelXp} XP`} icon={Zap} accent="#8B5CF6">
              <div className="flex h-64 flex-col justify-between">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.trend.slice(-7).map((p) => ({ ...p, xp: (data?.xp ?? 0) / 7 })) ?? []}>
                      <Area type="monotone" dataKey="xp" stroke="#8B5CF6" fill="rgba(139,92,246,0.2)" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-[11px] font-semibold text-black/50 dark:text-white/50">
                    <span>{data?.xp ?? 0} XP earned</span>
                    <span>{nextLevelXp} XP</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-pill bg-black/[0.06] dark:bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((data?.xp ?? 0) / nextLevelXp) * 100)}%` }}
                      transition={{ duration: 0.9 }}
                      className="h-full rounded-pill bg-gradient-to-r from-purple-500 to-fuchsia-500"
                    />
                  </div>
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
