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
  { href: "#premium", label: "Premium" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-black/5 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-ink/85"
          : "bg-transparent",
      )}
    >
      <div className="container-px flex h-16 items-center justify-between sm:h-[72px]">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-black/60 transition-colors hover:text-crimson dark:text-white/60 dark:hover:text-crimson-light"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link
              href={user.role === "admin" ? "/admin" : "/dashboard"}
              className="btn-primary !px-5 !py-2.5"
            >
              {user.role === "admin" ? "Admin" : "Dashboard"}
            </Link>
          ) : (
            <>
              <Link href="/signin" className="btn-ghost !px-5 !py-2.5">
                Sign in
              </Link>
              <Link href="/signin" className="btn-primary !px-5 !py-2.5">
                Start free
              </Link>
            </>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lgx border border-black/10 md:hidden dark:border-white/15"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-black/5 bg-white md:hidden dark:border-white/10 dark:bg-ink"
          >
            <div className="container-px flex flex-col gap-1 py-4">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lgx px-3 py-2.5 text-sm font-medium text-black/70 hover:bg-crimson-soft hover:text-crimson dark:text-white/70 dark:hover:bg-crimson/10"
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
