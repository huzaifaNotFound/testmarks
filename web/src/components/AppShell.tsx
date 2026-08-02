"use client";

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ClipboardList,
  ChartColumn,
  Sparkles,
  User,
  Shield,
  Flame,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import Logo from "./Logo";
import { mockAnalytics } from "@/lib/mock-data";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

const NAV: NavItem[] = [
  { href: "/dashboard",  label: "Dashboard",   icon: LayoutDashboard },
  { href: "/mock-test",  label: "Mock Tests",   icon: ClipboardList },
  { href: "/analytics",  label: "Analytics",    icon: ChartColumn },
  { href: "/premium",    label: "Premium",      icon: Sparkles },
  { href: "/profile",    label: "Profile",      icon: User },
  { href: "/admin",      label: "Admin",        icon: Shield, adminOnly: true },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const streak = mockAnalytics(user?.stream ?? "neet").streak;
  const items = NAV.filter((n) => !n.adminOnly || user?.role === "admin");

  const navList = (
    <nav className="flex flex-col gap-0.5 px-3 py-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150",
              active
                ? "bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary-light"
                : "text-ink/50 hover:bg-[rgba(100,80,50,0.05)] hover:text-ink dark:text-white/45 dark:hover:bg-white/[0.05] dark:hover:text-white",
            )}
          >
            {/* Active accent bar */}
            {active && (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary dark:bg-primary-light" />
            )}
            <item.icon
              size={15}
              className={cn(
                "shrink-0 transition-colors",
                active ? "text-primary dark:text-primary-light" : ""
              )}
            />
            <span>{item.label}</span>
            {active && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <div className="flex h-full flex-col">
      {/* Logo area */}
      <div className="px-5 pb-4 pt-5">
        <Logo />
      </div>

      {/* Section label */}
      <div className="px-6 pb-1">
        <span className="label text-[9px]">Navigation</span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto">{navList}</div>

      {/* Bottom section */}
      <div className="border-t border-[rgba(100,80,50,0.10)] dark:border-[rgba(255,230,180,0.06)] px-4 py-4 space-y-2">
        {/* Streak card */}
        <div className="flex items-center gap-2.5 rounded-lg bg-accent-soft border border-accent/15 px-3 py-2 dark:bg-accent/10 dark:border-accent/20">
          <Flame size={13} className="text-accent shrink-0" fill="currentColor" />
          <span className="text-[12px] font-semibold text-accent-deep dark:text-amber-300">
            {streak} day streak
          </span>
        </div>

        {/* User brief */}
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-white shrink-0">
            {(user?.name ?? "S").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-semibold text-ink dark:text-white">{user?.name}</div>
            <div className="truncate text-[10px] text-ink/45 dark:text-white/40">{user?.premium ? "Premium" : "Free plan"}</div>
          </div>
        </div>

        <button
          onClick={() => { signOut(); router.replace("/"); }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] font-medium text-ink/45 transition-colors hover:bg-[rgba(100,80,50,0.06)] hover:text-ink dark:text-white/40 dark:hover:bg-white/[0.04] dark:hover:text-white"
        >
          <LogOut size={13} className="shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface dark:bg-[#101114]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 border-r border-[rgba(100,80,50,0.12)] bg-ivory lg:block dark:border-[rgba(255,230,180,0.07)] dark:bg-[#17181D]">
        {sidebarInner}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/25 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-[220px] border-r border-[rgba(100,80,50,0.12)] bg-ivory dark:border-[rgba(255,230,180,0.07)] dark:bg-[#17181D]"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink/40 hover:bg-[rgba(100,80,50,0.06)] dark:text-white/40 dark:hover:bg-white/[0.05]"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
              {sidebarInner}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-[rgba(100,80,50,0.10)] bg-[#F6F3EC]/92 px-4 backdrop-blur-md sm:px-6 dark:border-[rgba(255,230,180,0.07)] dark:bg-[#101114]/92">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(100,80,50,0.18)] text-ink/55 transition-colors hover:bg-[rgba(100,80,50,0.06)] lg:hidden dark:border-[rgba(255,230,180,0.12)] dark:text-white/55"
              aria-label="Open menu"
            >
              <Menu size={15} />
            </button>
            {/* Breadcrumb page title (could be extended) */}
            <div className="flex items-center gap-2 text-[13px] font-medium text-ink/45 dark:text-white/35">
              <BookOpen size={13} className="text-primary dark:text-primary-light" />
              <span>Test Marks AI</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(100,80,50,0.18)] text-ink/55 transition-colors hover:bg-[rgba(100,80,50,0.06)] dark:border-[rgba(255,230,180,0.12)] dark:text-white/55"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-[rgba(100,80,50,0.18)] py-1 pl-1.5 pr-2.5 transition-colors hover:bg-[rgba(100,80,50,0.05)] dark:border-[rgba(255,230,180,0.12)] dark:hover:bg-white/[0.04]"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-white">
                  {(user?.name ?? "S").slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden text-[13px] font-medium text-ink/70 sm:block dark:text-white/65">
                  {user?.name?.split(" ")[0] ?? "Account"}
                </span>
                <ChevronDown
                  size={12}
                  className={cn("text-ink/35 transition-transform dark:text-white/35", menuOpen && "rotate-180")}
                />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-[rgba(100,80,50,0.15)] bg-ivory p-1.5 shadow-3 dark:border-[rgba(255,230,180,0.10)] dark:bg-[#1E2028]"
                    >
                      <div className="border-b border-[rgba(100,80,50,0.10)] px-3 pb-2.5 pt-2 dark:border-[rgba(255,230,180,0.07)]">
                        <div className="text-[13px] font-semibold text-ink dark:text-white">{user?.name}</div>
                        <div className="text-[11px] text-ink/40 dark:text-white/40">{user?.email}</div>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="mt-1 block rounded-lg px-3 py-2 text-[13px] font-medium text-ink/70 transition-colors hover:bg-[rgba(100,80,50,0.05)] dark:text-white/65 dark:hover:bg-white/[0.05]"
                      >
                        Profile & Settings
                      </Link>
                      <Link
                        href="/premium"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-[13px] font-medium text-ink/70 transition-colors hover:bg-[rgba(100,80,50,0.05)] dark:text-white/65 dark:hover:bg-white/[0.05]"
                      >
                        Premium
                      </Link>
                      <div className="mt-1 border-t border-[rgba(100,80,50,0.08)] pt-1 dark:border-[rgba(255,230,180,0.06)]">
                        <button
                          onClick={() => { setMenuOpen(false); signOut(); router.replace("/"); }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-danger transition-colors hover:bg-danger-soft dark:hover:bg-danger/10"
                        >
                          <LogOut size={13} /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="container-px flex-1 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
