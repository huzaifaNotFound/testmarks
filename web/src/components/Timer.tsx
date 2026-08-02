"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";

export default function Timer({
  totalSeconds,
  onExpire,
  onTick,
  compact = false,
}: {
  totalSeconds: number;
  onExpire: () => void;
  onTick?: (remaining: number) => void;
  compact?: boolean;
}) {
  const [left, setLeft] = useState(totalSeconds);
  const expired = useRef(false);

  useEffect(() => {
    expired.current = false;
    const interval = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          if (!expired.current) {
            expired.current = true;
            setTimeout(() => onExpire(), 50);
          }
          return 0;
        }
        const next = s - 1;
        onTick?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [totalSeconds, onExpire, onTick]);

  const danger = left < 300;
  const warn = !danger && left < 900;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border font-bold tabular-nums transition-colors",
        compact ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base",
        danger
          ? "animate-pulse border-crimson bg-crimson-soft text-crimson dark:bg-crimson/20 dark:text-crimson-light"
          : warn
            ? "border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400"
            : "border-black/10 bg-white text-ink dark:border-white/15 dark:bg-white/5 dark:text-white",
      )}
    >
      <Clock size={compact ? 15 : 17} className={danger ? "animate-pulse" : ""} />
      {formatTime(left)}
    </div>
  );
}
