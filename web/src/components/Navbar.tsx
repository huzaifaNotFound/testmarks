"use client";

import { Menu, X, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { useAuth } from "@/lib/auth";

const LINKS = [
  { href: "#streams", label: "Exam Streams" },
  { href: "#how", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#premium", label: "Pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-[rgba(100,80,50,0.15)] bg-[#F6F3EC]/92 backdrop-blur-xl shadow-[0_1px_8px_rgba(30,27,22,0.06)] dark:border-[rgba(255,230,180,0.08)] dark:bg-[#101114]/92"
          : "bg-transparent",
      )}
    >
      <div className="container-px flex h-[64px] items-center justify-between">
        <Logo />

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] font-medium text-ink/50 transition-colors hover:text-primary dark:text-white/50 dark:hover:text-primary-light"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2.5 md:flex">
          {user ? (
            <Link
              href={user.role === "admin" ? "/admin" : "/dashboard"}
              className="btn-primary btn-sm !px-5 !py-2"
            >
              {user.role === "admin" ? "Admin Panel" : "Open Dashboard"}
            </Link>
          ) : (
            <>
              <Link href="/signin" className="btn-ghost btn-sm !px-4 !py-2 text-ink/65">
                Sign in
              </Link>
              <Link href="/signin" className="btn-accent btn-sm !px-5 !py-2">
                <BookOpen size={13} /> Start free
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(100,80,50,0.18)] text-ink/55 transition-colors hover:bg-[rgba(100,80,50,0.06)] md:hidden dark:border-[rgba(255,230,180,0.12)] dark:text-white/55"
          aria-label="Toggle menu"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[rgba(100,80,50,0.12)] bg-[#F6F3EC] md:hidden dark:border-[rgba(255,230,180,0.07)] dark:bg-[#17181D]"
          >
            <div className="container-px flex flex-col gap-0.5 py-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-ink/55 transition-colors hover:bg-[rgba(100,80,50,0.06)] hover:text-primary dark:text-white/55 dark:hover:bg-white/[0.04] dark:hover:text-primary-light"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2"
              >
                {user ? (user.role === "admin" ? "Admin Panel" : "Dashboard") : "Sign in / Start free"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
