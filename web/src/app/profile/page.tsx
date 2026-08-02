"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  GraduationCap,
  Crown,
  Volume2,
  Sun,
  Moon,
  LogOut,
  Save,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { PageHeader } from "@/components/ui";
import { RequireAuth, useAuth } from "@/lib/auth";
import { MOCK_STREAMS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";

const SUBJECT_INTERESTS = ["Physics", "Chemistry", "Biology", "Mathematics", "Organic Chemistry", "Genetics", "Calculus", "Ecology"];

export default function ProfilePage() {
  const { user, updateUser, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? "");
  const [sound, setSound] = useState(true);
  const [interests, setInterests] = useState<string[]>(SUBJECT_INTERESTS.slice(0, 4));
  const [saved, setSaved] = useState(false);

  const toggleInterest = (s: string) =>
    setInterests((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const save = () => {
    updateUser({ name: name.trim() || user?.name });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const streamName = MOCK_STREAMS.find((s) => s.id === user?.stream)?.name ?? "Not selected";

  return (
    <RequireAuth>
      <AppShell>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl space-y-6"
        >
          <PageHeader title="Profile Settings" subtitle="Manage your educational profile and parameters." />

          {/* Profile overview card */}
          <div className="card p-6 sm:p-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start text-center sm:text-left">
              <div className="relative shrink-0">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-crimson text-2xl font-extrabold text-white">
                  {(user?.name ?? "S").slice(0, 1).toUpperCase()}
                </span>
                {user?.premium && (
                  <span className="absolute -bottom-1.5 -right-1.5 inline-flex h-6.5 w-6.5 items-center justify-center rounded-md border-2 border-white bg-amber-400 text-ink dark:border-ink">
                    <Crown size={11} className="text-black" />
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                <h2 className="heading text-lg font-bold text-ink dark:text-white">{user?.name}</h2>
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-black/50 sm:justify-start dark:text-white/45 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Mail size={13} /> {user?.email}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap size={13} /> {streamName}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start pt-1">
                  <span className="chip-crimson">
                    {user?.premium ? "Premium Access" : "Free Plan"}
                  </span>
                  <span className="chip">{user?.role === "admin" ? "Administrator" : "Student"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Display name settings card */}
          <div className="card p-6 space-y-4">
            <div>
              <label htmlFor="profile-name-input" className="label text-black/50 dark:text-white/40 mb-1.5 block">Display Name</label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="profile-name-input"
                  className="input flex-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
                <button onClick={save} className="btn-primary shrink-0 px-5">
                  <Save size={14} /> {saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Interests card */}
          <div className="card p-6 space-y-3">
            <div>
              <h3 className="label text-black/50 dark:text-white/40">Subject Interests</h3>
              <p className="text-xs text-black/40 dark:text-white/40 mb-3 leading-relaxed">
                Configure your core focus areas to align recommended diagnostic review sessions.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_INTERESTS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleInterest(s)}
                  className={cn(
                    "chip !px-3 !py-1.5 text-xs font-semibold focus-visible:ring-2",
                    interests.includes(s)
                      ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light font-semibold"
                      : "border-black/[0.08] bg-black/[0.02] dark:border-white/10 hover:border-crimson/50",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Settings list card */}
          <div className="card divide-y divide-black/[0.06] dark:divide-white/[0.06] overflow-hidden">
            {[
              {
                icon: Volume2,
                title: "Sound effects",
                sub: "Trigger completion cues on diagnostic submissions",
                value: sound,
                onChange: () => setSound((v) => !v),
              },
              {
                icon: theme === "dark" ? Moon : Sun,
                title: "App theme",
                sub: theme === "dark" ? "Dark mode active" : "Light mode active",
                value: theme === "dark",
                onChange: () => setTheme(theme === "dark" ? "light" : "dark"),
              },
            ].map((s) => (
              <div key={s.title} className="flex items-center justify-between gap-4 p-5 hover:bg-black/[0.005] dark:hover:bg-white/[0.005] transition-colors">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.06] bg-black/[0.02] text-crimson dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <s.icon size={15} />
                  </span>
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-ink dark:text-white">{s.title}</div>
                    <div className="text-xs text-black/45 dark:text-white/45 leading-relaxed">{s.sub}</div>
                  </div>
                </div>
                {/* Modern Switch */}
                <button
                  onClick={s.onChange}
                  className={cn(
                    "relative h-5 w-9 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-crimson",
                    s.value ? "bg-crimson" : "bg-black/10 dark:bg-white/15",
                  )}
                  aria-label={`Toggle ${s.title}`}
                  role="switch"
                  aria-checked={s.value}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
                      s.value ? "left-[18px]" : "left-0.5",
                    )}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Premium promo banner */}
          <div className="card p-5 flex items-center gap-4">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.06] bg-black/[0.02] text-amber-500 dark:border-white/[0.06] dark:bg-white/[0.02]">
              <Sparkles size={15} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink dark:text-white">
                {user?.premium ? "Premium membership active" : "Upgrade account to premium"}
              </div>
              <div className="text-xs text-black/45 dark:text-white/45 truncate">
                {user?.premium ? "You have access to unlimited papers." : "Unlock custom study guides and analytics."}
              </div>
            </div>
            {!user?.premium && (
              <button onClick={() => router.push("/premium")} className="btn-primary btn-sm shrink-0">
                Upgrade
              </button>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                signOut();
                router.replace("/");
              }}
              className="btn-ghost !border-crimson/20 !text-crimson bg-transparent hover:!bg-crimson/5"
            >
              <LogOut size={14} /> Sign out of account
            </button>
          </div>
        </motion.div>
      </AppShell>
    </RequireAuth>
  );
}
