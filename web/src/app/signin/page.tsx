"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  User as UserIcon,
  ArrowLeft,
  LogOut,
  ArrowRight,
  GraduationCap,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signUp, signOut, user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<Role>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (mode === "signup" && name.trim().length < 2) return "Enter your full name.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const u =
        mode === "signup"
          ? await signUp({ name: name.trim(), email, password, role, adminCode })
          : await signIn({ name: name.trim(), email, password, role, adminCode });
      if (u.role === "admin") router.replace("/admin");
      else {
        const onboarded = window.localStorage.getItem("tma_onboarded") === "1";
        router.replace(onboarded ? "/dashboard" : "/onboarding");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToApp = () => router.replace(user?.role === "admin" ? "/admin" : "/dashboard");

  return (
    <div className="relative flex min-h-screen bg-surface dark:bg-[#101114]">
      {/* Left decorative panel — hidden on mobile */}
      <div className="relative hidden w-[460px] shrink-0 flex-col justify-between overflow-hidden border-r border-[rgba(100,80,50,0.12)] bg-ivory p-10 lg:flex dark:border-white/[0.07] dark:bg-[#17181D]">
        <div className="relative z-10">
          <Logo />
        </div>

        {/* Illustration */}
        <div className="relative my-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-[rgba(100,80,50,0.15)] bg-white shadow-2 dark:border-white/[0.06] dark:bg-white/[0.02]">
          <Image
            src="/illustrations/auth.png"
            alt="Authentication Illustration"
            fill
            className="object-cover animate-float"
            priority
          />
        </div>

        <div className="relative z-10 space-y-4">
          <p className="text-xl font-bold leading-snug tracking-tight text-ink dark:text-white" style={{ fontFamily: '"Crimson Pro", Georgia, serif' }}>
            Smarter preparation.<br />
            <span className="text-primary dark:text-primary-light">Better results.</span>
          </p>
          <p className="text-[13px] leading-relaxed text-ink/50 dark:text-white/50">
            AI-powered mock tests calibrated to your exam stream. Get instant explanations, track your weak topics, and improve every session.
          </p>
          <div className="space-y-2 pt-2">
            {[
              "Adaptive AI mock tests for NEET, JEE, CBSE",
              "Detailed performance analytics",
              "AI Coach for instant explanations",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2 text-xs text-ink/60 dark:text-white/55">
                <Check size={13} className="text-primary dark:text-primary-light shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-[11px] text-ink/30 dark:text-white/30">© 2026 Test Marks AI</p>
      </div>

      {/* Main auth area */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-ink/45 transition-colors hover:text-primary dark:text-white/45"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>

          {/* Logo on mobile */}
          <div className="mb-6 lg:hidden">
            <Logo />
          </div>

          <div className="card p-7 sm:p-9 bg-ivory dark:bg-[#17181D]">
            {user ? (
              <div className="text-center">
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(100,80,50,0.12)] bg-[rgba(100,80,50,0.03)] text-primary dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <UserIcon size={20} />
                </span>
                <h1 className="heading mt-4 text-lg">Signed in as {user.email}</h1>
                <p className="mt-1 text-xs text-ink/45 dark:text-white/45">
                  {user.name} · {user.role === "admin" ? "Administrator" : "Student"}
                  {user.premium ? " · Premium" : " · Free plan"}
                </p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <button onClick={goToApp} className="btn-primary">
                    Continue <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                    }}
                    className="btn-ghost"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(100,80,50,0.12)] bg-[rgba(100,80,50,0.03)] text-primary dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <GraduationCap size={18} />
                  </span>
                  <div>
                    <h1 className="heading text-lg">Test Marks AI</h1>
                    <p className="text-[11.5px] text-ink/45 dark:text-white/45">
                      {mode === "signin" ? "Welcome back. Let's train." : "Create your account."}
                    </p>
                  </div>
                </div>

                {/* Mode toggle */}
                <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-[rgba(100,80,50,0.06)] p-1 dark:bg-white/[0.04]">
                  {(["signin", "signup"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMode(m);
                        setError(null);
                      }}
                      className={cn(
                        "rounded-md py-1.5 text-xs font-semibold transition-all cursor-pointer",
                        mode === m
                          ? "bg-white text-ink shadow-1 dark:bg-[#1E2028] dark:text-white"
                          : "text-ink/50 dark:text-white/50",
                      )}
                    >
                      {m === "signin" ? "Sign in" : "Sign up"}
                    </button>
                  ))}
                </div>

                {/* Role toggle */}
                <div className="mt-2.5 grid grid-cols-2 gap-1 rounded-lg bg-[rgba(100,80,50,0.06)] p-1 dark:bg-white/[0.04]">
                  {(
                    [
                      { id: "student", label: "Student", icon: UserIcon },
                      { id: "admin", label: "Admin", icon: ShieldCheck },
                    ] as const
                  ).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-md py-1.5 text-xs font-semibold transition-all cursor-pointer",
                        role === r.id
                          ? "bg-primary text-white dark:bg-white dark:text-ink"
                          : "text-ink/50 dark:text-white/50",
                      )}
                    >
                      <r.icon size={13} /> {r.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <AnimatePresence mode="wait">
                    {mode === "signup" && (
                      <motion.div
                        key="name"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <label htmlFor="signin-name" className="label mb-1 block">
                          Full name
                        </label>
                        <input
                          id="signin-name"
                          className="input"
                          placeholder="Aarav Sharma"
                          autoComplete="name"
                          value={name}
                          required
                          onChange={(e) => setName(e.target.value)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label htmlFor="signin-email" className="label mb-1 block">
                      Email address
                    </label>
                    <input
                      id="signin-email"
                      className="input"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="signin-password" className="label mb-1 block">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="signin-password"
                        className="input pr-10"
                        type={showPw ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete={mode === "signin" ? "current-password" : "new-password"}
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 transition-colors hover:text-primary dark:text-white/45"
                        aria-label="Toggle password visibility"
                      >
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {role === "admin" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <label htmlFor="signin-admin-code" className="label mb-1 block">
                          Admin access code
                        </label>
                        <input
                          id="signin-admin-code"
                          className="input"
                          type="password"
                          placeholder="Secret access code"
                          autoComplete="off"
                          value={adminCode}
                          required
                          onChange={(e) => setAdminCode(e.target.value)}
                        />
                        <p className="mt-1 text-[10px] text-ink/40 dark:text-white/40">
                          Required to verify admin authority.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <motion.p
                      role="alert"
                      aria-live="assertive"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-danger/25 bg-danger-soft px-3 py-2 text-xs font-semibold text-danger"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button type="submit" disabled={loading} className="btn-primary w-full mt-2 cursor-pointer">
                    {loading ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <GraduationCap size={15} />
                    )}
                    {mode === "signin" ? "Sign in" : "Create account"}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
