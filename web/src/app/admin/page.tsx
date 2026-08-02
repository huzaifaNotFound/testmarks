"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ClipboardList,
  Percent,
  Brain,
  Search,
  Shield,
  ShieldOff,
  Crown,
  Plus,
  BarChart3,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import { RequireAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface Row {
  id: string;
  name: string;
  email: string;
  stream: string;
  tests: number;
  avgScore: number;
  blocked: boolean;
  premium: boolean;
}

const INITIAL_USERS: Row[] = [
  { id: "u1", name: "Aarav Sharma", email: "aarav@example.com", stream: "NEET", tests: 14, avgScore: 71, blocked: false, premium: true },
  { id: "u2", name: "Priya Patel", email: "priya@example.com", stream: "JEE Mains", tests: 9, avgScore: 64, blocked: false, premium: false },
  { id: "u3", name: "Rohan Gupta", email: "rohan@example.com", stream: "CBSE Class 10", tests: 22, avgScore: 82, blocked: false, premium: true },
  { id: "u4", name: "Sneha Reddy", email: "sneha@example.com", stream: "NEET", tests: 5, avgScore: 55, blocked: false, premium: false },
  { id: "u5", name: "Karan Singh", email: "karan@example.com", stream: "JEE Advanced", tests: 17, avgScore: 74, blocked: true, premium: false },
  { id: "u6", name: "Meera Nair", email: "meera@example.com", stream: "CBSE Class 11", tests: 8, avgScore: 69, blocked: false, premium: false },
  { id: "u7", name: "Aditya Verma", email: "aditya@example.com", stream: "JEE Mains", tests: 31, avgScore: 78, blocked: false, premium: true },
  { id: "u8", name: "Ishita Bose", email: "ishita@example.com", stream: "NEET", tests: 3, avgScore: 47, blocked: false, premium: false },
];

const TEST_BANK = [
  { id: "t1", title: "NEET Full Diagnostic", stream: "NEET", questions: 50, avgScore: 62 },
  { id: "t2", title: "JEE Mains Full Mock 1", stream: "JEE Mains", questions: 50, avgScore: 58 },
  { id: "t3", title: "JEE Advanced Physics Focus", stream: "JEE Advanced", questions: 30, avgScore: 44 },
  { id: "t4", title: "CBSE 10 Science Midterm", stream: "CBSE Class 10", questions: 40, avgScore: 71 },
  { id: "t5", title: "NEET Biology Focus", stream: "NEET", questions: 30, avgScore: 76 },
  { id: "t6", title: "CBSE 11 Physics Chapter Test", stream: "CBSE Class 11", questions: 20, avgScore: 68 },
];

const WEAK_TOPICS = [
  { topic: "Electrostatics", students: 142, avgAccuracy: 0.38 },
  { topic: "Chemical Bonding", students: 128, avgAccuracy: 0.44 },
  { topic: "Rotational Motion", students: 115, avgAccuracy: 0.41 },
  { topic: "Human Physiology", students: 98, avgAccuracy: 0.52 },
  { topic: "Integration", students: 87, avgAccuracy: 0.47 },
  { topic: "Organic Mechanisms", students: 76, avgAccuracy: 0.55 },
];

const PLATFORM_TREND = [
  { day: "Mon", users: 320, tests: 410 },
  { day: "Tue", users: 348, tests: 456 },
  { day: "Wed", users: 372, tests: 502 },
  { day: "Thu", users: 401, tests: 544 },
  { day: "Fri", users: 428, tests: 590 },
  { day: "Sat", users: 467, tests: 672 },
  { day: "Sun", users: 512, tests: 701 },
];

function AdminDashboard() {
  const [users, setUsers] = useState<Row[]>(INITIAL_USERS);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()) ||
          u.stream.toLowerCase().includes(query.toLowerCase()),
      ),
    [users, query],
  );

  const toggleBlock = (id: string) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, blocked: !u.blocked } : u)));
  const togglePremium = (id: string) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, premium: !u.premium } : u)));

  const avgAll = Math.round(users.reduce((s, u) => s + u.avgScore, 0) / users.length);

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="heading text-2xl sm:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            Platform overview.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total users" value={users.length + 3124} icon={Users} accent="#DC143C" sub="platform-wide" />
          <StatCard label="Tests taken (today)" value={701} icon={ClipboardList} accent="#0EA5E9" sub="+4.2% vs yesterday" />
          <StatCard label="Avg score" value={avgAll} suffix="%" icon={Percent} accent="#10B981" sub="all users" />
          <StatCard label="Top weak topic" value={WEAK_TOPICS[0].students} icon={Brain} accent="#F59E0B" sub={WEAK_TOPICS[0].topic} />
        </div>

        <ChartCard title="Platform activity" subtitle="Active users & tests, last 7 days" icon={BarChart3} className="mt-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PLATFORM_TREND} margin={{ top: 6, right: 4, left: -18, bottom: 0 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, background: "var(--color-surface)", border: "1px solid rgba(0,0,0,0.08)" }} />
                <Bar dataKey="users" name="Users" fill="#DC143C" radius={[6, 6, 0, 0]} />
                <Bar dataKey="tests" name="Tests" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <ChartCard title="Users" subtitle={`${filtered.length} shown · search to filter`} icon={Users}>
            <div className="relative mb-3">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/35" />
              <input
                className="input !pl-10"
                placeholder="Search name, email or stream…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {filtered.map((u) => (
                <div
                  key={u.id}
                  className={cn(
                    "flex flex-wrap items-center gap-3 rounded-lgx border border-black/5 p-3 dark:border-white/10",
                    u.blocked && "opacity-55",
                  )}
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lgx bg-crimson-soft text-xs font-bold text-crimson dark:bg-crimson/15">
                    {u.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-sm font-semibold">
                      <span className="truncate">{u.name}</span>
                      {u.premium && <Crown size={12} className="shrink-0 text-amber-500" />}
                    </div>
                    <div className="truncate text-[11px] text-black/45 dark:text-white/45">
                      {u.email} · {u.stream}
                    </div>
                  </div>
                  <div className="hidden text-right text-[11px] font-semibold text-black/50 sm:block dark:text-white/50">
                    {u.tests} tests · {u.avgScore}%
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      onClick={() => togglePremium(u.id)}
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-lgx border transition-colors",
                        u.premium
                          ? "border-amber-400/40 bg-amber-400/10 text-amber-600 dark:text-amber-400"
                          : "border-black/10 text-black/45 hover:border-amber-400 hover:text-amber-600 dark:border-white/15 dark:text-white/45",
                      )}
                      title={u.premium ? "Revoke premium" : "Grant premium"}
                    >
                      {u.premium ? <Crown size={14} /> : <Plus size={14} />}
                    </button>
                    <button
                      onClick={() => toggleBlock(u.id)}
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded-lgx border transition-colors",
                        u.blocked
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-600 dark:text-emerald-400"
                          : "border-black/10 text-black/45 hover:border-crimson hover:text-crimson dark:border-white/15 dark:text-white/45",
                      )}
                      title={u.blocked ? "Unblock user" : "Block user"}
                    >
                      {u.blocked ? <Shield size={14} /> : <ShieldOff size={14} />}
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-black/45 dark:text-white/45">No users match “{query}”.</p>
              )}
            </div>
          </ChartCard>

          <div className="flex flex-col gap-5">
            <ChartCard title="Test bank" subtitle={`${TEST_BANK.length} published tests`} icon={ClipboardList}>
              <div className="space-y-2">
                {TEST_BANK.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-lgx border border-black/5 px-3 py-2.5 dark:border-white/10">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{t.title}</span>
                      <span className="text-[11px] text-black/45 dark:text-white/45">
                        {t.stream} · {t.questions} questions
                      </span>
                    </span>
                    <span
                      className={cn(
                        "rounded-pill px-2.5 py-1 text-[11px] font-bold tabular-nums",
                        t.avgScore >= 70
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : t.avgScore >= 55
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "bg-crimson-soft text-crimson dark:bg-crimson/15",
                      )}
                    >
                      {t.avgScore}% avg
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Top weak topics platform-wide" subtitle="Students struggling most" icon={Brain} accent="#F59E0B">
              <div className="space-y-3">
                {WEAK_TOPICS.map((t) => (
                  <div key={t.topic}>
                    <div className="mb-1 flex justify-between text-xs font-semibold">
                      <span>{t.topic}</span>
                      <span className="text-black/45 dark:text-white/45">{t.students} students</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-pill bg-black/[0.06] dark:bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${t.avgAccuracy * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-pill bg-gradient-to-r from-crimson to-crimson-light"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}

export default function AdminPage() {
  return (
    <RequireAuth role="admin">
      <AdminDashboard />
    </RequireAuth>
  );
}
