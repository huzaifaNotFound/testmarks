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
    <nav className="flex flex-col gap-0.5 px-3 py-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors",
              active
                ? "text-crimson bg-crimson-soft dark:bg-crimson/10 dark:text-crimson-light"
                : "text-black/55 hover:bg-black/[0.04] hover:text-ink dark:text-white/50 dark:hover:bg-white/[0.05] dark:hover:text-white",
            )}
          >
            <item.icon
              size={16}
              className={cn(
                "shrink-0 transition-colors",
                active ? "text-crimson dark:text-crimson-light" : ""
              )}
            />
            <span>{item.label}</span>
            {active && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-crimson dark:bg-crimson-light" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="px-5 pb-3 pt-5">
        <Logo />
      </div>

      {/* Divider */}
      <div className="mx-4 mb-2 h-px bg-black/[0.06] dark:bg-white/[0.06]" />

      {/* Nav */}
      <div className="flex-1 overflow-y-auto">{navList}</div>

      {/* Divider */}
      <div className="mx-4 mt-2 h-px bg-black/[0.06] dark:bg-white/[0.06]" />

      {/* Bottom area: streak + signout */}
      <div className="px-4 py-4 space-y-1">
        {/* Streak pill */}
        <div className="flex items-center gap-2 rounded-lg bg-black/[0.03] px-3 py-2 dark:bg-white/[0.04]">
          <Flame size={13} className="text-crimson shrink-0" fill="currentColor" />
          <span className="text-[12px] font-semibold text-black/60 dark:text-white/60">
            {streak} day streak
          </span>
        </div>
        <button
          onClick={() => {
            signOut();
            router.replace("/");
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-black/55 transition-colors hover:bg-black/[0.04] hover:text-ink dark:text-white/50 dark:hover:bg-white/[0.05] dark:hover:text-white"
        >
          <LogOut size={15} className="shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface dark:bg-[#0D0D10]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-black/[0.07] bg-white lg:block dark:border-white/[0.07] dark:bg-[#141416]">
        {sidebarInner}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-64 border-r border-black/[0.07] bg-white dark:border-white/[0.07] dark:bg-[#141416]"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-black/40 hover:bg-black/[0.05] dark:text-white/40 dark:hover:bg-white/[0.05]"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
              {sidebarInner}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-black/[0.07] bg-white/90 px-4 backdrop-blur-md sm:px-6 dark:border-white/[0.07] dark:bg-[#0D0D10]/90">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.09] text-black/60 transition-colors hover:border-black/20 hover:bg-black/[0.04] lg:hidden dark:border-white/10 dark:text-white/60 dark:hover:border-white/20 dark:hover:bg-white/[0.04]"
              aria-label="Open menu"
            >
              <Menu size={15} />
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.09] text-black/60 transition-colors hover:border-black/20 hover:bg-black/[0.04] dark:border-white/10 dark:text-white/60 dark:hover:border-white/20 dark:hover:bg-white/[0.04]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-black/[0.09] py-1 pl-1.5 pr-2.5 transition-colors hover:border-black/20 hover:bg-black/[0.03] dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/[0.04]"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-crimson text-[11px] font-bold text-white">
                  {(user?.name ?? "S").slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden text-[13px] font-medium text-ink/75 sm:block dark:text-white/70">
                  {user?.name?.split(" ")[0] ?? "Account"}
                </span>
                <ChevronDown
                  size={13}
                  className={cn("text-black/40 transition-transform dark:text-white/40", menuOpen && "rotate-180")}
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
                      className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-black/[0.07] bg-white p-1.5 shadow-3 dark:border-white/[0.08] dark:bg-[#1A1A1E]"
                    >
                      <div className="border-b border-black/[0.06] px-3 pb-2.5 pt-2 dark:border-white/[0.06]">
                        <div className="text-[13px] font-semibold text-ink dark:text-white">{user?.name}</div>
                        <div className="text-[11px] text-black/45 dark:text-white/45">{user?.email}</div>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="mt-1 block rounded-lg px-3 py-2 text-[13px] font-medium text-ink/75 transition-colors hover:bg-black/[0.04] dark:text-white/70 dark:hover:bg-white/[0.05]"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/premium"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-[13px] font-medium text-ink/75 transition-colors hover:bg-black/[0.04] dark:text-white/70 dark:hover:bg-white/[0.05]"
                      >
                        Premium
                      </Link>
                      <div className="mt-1 border-t border-black/[0.06] pt-1 dark:border-white/[0.06]">
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            signOut();
                            router.replace("/");
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-crimson transition-colors hover:bg-crimson-soft dark:hover:bg-crimson/10"
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
