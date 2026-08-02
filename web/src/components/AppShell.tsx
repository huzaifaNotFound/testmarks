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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mock-test", label: "Mock Tests", icon: ClipboardList },
  { href: "/analytics", label: "Analytics", icon: ChartColumn },
  { href: "/premium", label: "Premium", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/admin", label: "Admin", icon: Shield, adminOnly: true },
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
    <nav className="flex flex-col gap-1 p-4">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "group relative flex items-center gap-3 rounded-lgx px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "text-crimson"
                : "text-black/60 hover:bg-black/5 hover:text-ink dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white",
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-lgx bg-crimson-soft dark:bg-crimson/15"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <item.icon size={18} className="relative z-10" />
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-2 pt-6">
        <Logo />
      </div>
      {navList}
      <div className="mt-auto p-4">
        <button
          onClick={() => {
            signOut();
            router.replace("/");
          }}
          className="flex w-full items-center gap-3 rounded-lgx px-3.5 py-2.5 text-sm font-medium text-black/60 transition-colors hover:bg-crimson-soft hover:text-crimson dark:text-white/60 dark:hover:bg-crimson/10 dark:hover:text-crimson-light"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface dark:bg-ink">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-black/5 bg-white lg:block dark:border-white/10 dark:bg-white/[0.02]">
        {sidebarInner}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-72 bg-white dark:bg-ink border-r border-black/5 dark:border-white/10"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lgx text-black/60 dark:text-white/60 focus-visible:ring-2"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              {sidebarInner}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-black/5 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-white/10 dark:bg-ink/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lgx border border-black/10 lg:hidden dark:border-white/15 focus-visible:ring-2"
              aria-label="Open menu"
            >
              <Menu size={17} />
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-crimson-soft px-3 py-1 text-xs font-bold text-crimson dark:bg-crimson/15 dark:text-crimson-light">
              <Flame size={13} fill="currentColor" />
              {streak} day streak
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggle}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lgx border border-black/10 transition-colors hover:border-crimson hover:text-crimson dark:border-white/15 focus-visible:ring-2"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-pill border border-black/10 py-1 pl-1 pr-3 transition-colors hover:border-crimson dark:border-white/15 focus-visible:ring-2"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-crimson text-xs font-bold text-white shadow-1">
                  {(user?.name ?? "S").slice(0, 1).toUpperCase()}
                </span>
                <ChevronDown size={14} className={cn("transition-transform", menuOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 top-12 z-50 w-56 rounded-card border border-black/5 bg-white p-2 shadow-2 dark:border-white/10 dark:bg-ink"
                    >
                      <div className="border-b border-black/5 px-3 pb-2 pt-1.5 dark:border-white/10">
                        <div className="text-sm font-bold">{user?.name}</div>
                        <div className="text-xs text-black/50 dark:text-white/50">{user?.email}</div>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="mt-1 block rounded-lgx px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/premium"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lgx px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        Premium
                      </Link>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          signOut();
                          router.replace("/");
                        }}
                        className="mt-1 flex w-full items-center gap-2 rounded-lgx px-3 py-2 text-sm font-medium text-crimson hover:bg-crimson-soft dark:hover:bg-crimson/10"
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
        <main className="container-px flex-1 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
