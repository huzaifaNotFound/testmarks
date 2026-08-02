"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { useAuth } from "@/lib/auth";

const LINKS = [
  { href: "#streams", label: "Streams" },
  { href: "#how", label: "How it works" },
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
        "fixed inset-x-0 top-0 z-50 transition-all duration-200",
        scrolled
          ? "border-b border-black/[0.07] bg-white/92 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#0D0D10]/92"
          : "bg-transparent",
      )}
    >
      <div className="container-px flex h-[60px] items-center justify-between">
        <Logo />

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] font-medium text-black/55 transition-colors hover:text-ink dark:text-white/55 dark:hover:text-white"
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
              className="btn-primary btn-sm !px-4 !py-2"
            >
              {user.role === "admin" ? "Admin" : "Go to Dashboard"}
            </Link>
          ) : (
            <>
              <Link href="/signin" className="btn-ghost btn-sm !px-4 !py-2">
                Sign in
              </Link>
              <Link href="/signin" className="btn-primary btn-sm !px-4 !py-2">
                Start free →
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.09] text-black/60 transition-colors hover:bg-black/[0.04] md:hidden dark:border-white/10 dark:text-white/60 dark:hover:bg-white/[0.04]"
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
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-black/[0.07] bg-white md:hidden dark:border-white/[0.07] dark:bg-[#141416]"
          >
            <div className="container-px flex flex-col gap-0.5 py-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-black/60 transition-colors hover:bg-black/[0.04] hover:text-ink dark:text-white/60 dark:hover:bg-white/[0.05] dark:hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2"
              >
                {user ? (user.role === "admin" ? "Admin" : "Dashboard") : "Sign in / Start free"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
