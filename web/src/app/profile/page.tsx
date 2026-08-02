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
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
        <h1 className="heading text-2xl sm:text-3xl">Profile</h1>

        <div className="card mt-6 p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative">
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-card bg-gradient-to-br from-crimson to-crimson-deep text-3xl font-bold text-white shadow-glow">
                {(user?.name ?? "S").slice(0, 1).toUpperCase()}
              </span>
              {user?.premium && (
                <span className="absolute -bottom-1.5 -right-1.5 inline-flex h-8 w-8 items-center justify-center rounded-lgx border-2 border-white bg-amber-400 text-ink dark:border-ink">
                  <Crown size={15} />
                </span>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="heading text-xl">{user?.name}</h2>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-xs text-black/50 sm:justify-start dark:text-white/50">
                <span className="inline-flex items-center gap-1">
                  <Mail size={12} /> {user?.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <GraduationCap size={12} /> {streamName}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                <span className="chip border-crimson/30 bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light">
                  {user?.premium ? "Premium member" : "Free plan"}
                </span>
                <span className="chip">{user?.role === "admin" ? "Administrator" : "Student"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-5 p-6">
          <div className="label mb-2">Display name</div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={save} className="btn-primary shrink-0">
              <Save size={15} /> {saved ? "Saved!" : "Save"}
            </button>
          </div>
        </div>

        <div className="card mt-5 p-6">
          <div className="label mb-3">Subject interests</div>
          <div className="flex flex-wrap gap-2">
            {SUBJECT_INTERESTS.map((s) => (
              <button
                key={s}
                onClick={() => toggleInterest(s)}
                className={cn(
                  "chip !px-4 !py-2 text-sm",
                  interests.includes(s)
                    ? "border-crimson bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light"
                    : "hover:border-crimson",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-black/40 dark:text-white/40">
            The AI coach weights your focus tests toward these subjects.
          </p>
        </div>

        <div className="card mt-5 divide-y divide-black/5 p-0 dark:divide-white/10">
          {[
            {
              icon: Volume2,
              title: "Sound effects",
              sub: "Play a chime when a test is submitted",
              value: sound,
              onChange: () => setSound((v) => !v),
            },
            {
              icon: theme === "dark" ? Moon : Sun,
              title: "Theme",
              sub: theme === "dark" ? "Dark mode is on" : "Light mode is on",
              value: theme === "dark",
              onChange: () => setTheme(theme === "dark" ? "light" : "dark"),
            },
          ].map((s) => (
            <div key={s.title} className="flex items-center gap-3.5 p-5">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lgx bg-crimson-soft text-crimson dark:bg-crimson/15 dark:text-crimson-light">
                <s.icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{s.title}</div>
                <div className="text-xs text-black/45 dark:text-white/45">{s.sub}</div>
              </div>
              <button
                onClick={s.onChange}
                className={cn(
                  "relative h-7 w-12 rounded-pill transition-colors",
                  s.value ? "bg-crimson" : "bg-black/15 dark:bg-white/15",
                )}
                aria-label={`Toggle ${s.title}`}
              >
                <span
                  className={cn(
                    "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all",
                    s.value ? "left-6" : "left-1",
                  )}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="card mt-5 flex items-center gap-4 p-6">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lgx bg-gradient-to-br from-amber-400 to-crimson text-white">
            <Sparkles size={18} />
          </span>
          <div className="flex-1">
            <div className="text-sm font-semibold">{user?.premium ? "Premium is active" : "Unlock the full coach"}</div>
            <div className="text-xs text-black/45 dark:text-white/45">
              {user?.premium ? "Thanks for being a member!" : "Unlimited tests + personal AI coach."}
            </div>
          </div>
          {!user?.premium && (
            <button onClick={() => router.push("/premium")} className="btn-primary !px-4 !py-2 text-xs">
              Upgrade
            </button>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              signOut();
              router.replace("/");
            }}
            className="btn-ghost !border-crimson/30 !text-crimson"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </motion.div>
      </AppShell>
    </RequireAuth>
  );
}
