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
  const expiredRef = useRef(false);
  const onTickRef = useRef(onTick);
  const onExpireRef = useRef(onExpire);

  // Keep refs updated with latest callbacks
  useEffect(() => {
    onTickRef.current = onTick;
    onExpireRef.current = onExpire;
  });

  // Reset timer when totalSeconds prop changes
  useEffect(() => {
    setLeft(totalSeconds);
    expiredRef.current = false;
  }, [totalSeconds]);

  // Interval countdown effect
  useEffect(() => {
    if (left <= 0) return;
    const interval = setInterval(() => {
      setLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [left > 0]);

  // Notify parent component AFTER render when remaining time changes
  useEffect(() => {
    onTickRef.current?.(left);
    if (left <= 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpireRef.current?.();
    }
  }, [left]);

  const danger = left < 300;
  const warn = !danger && left < 900;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border font-bold tabular-nums transition-colors",
        compact ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base",
        danger
          ? "animate-pulse border-danger bg-danger-soft text-danger dark:bg-danger/20 dark:text-danger-dark"
          : warn
            ? "border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400"
            : "border-[rgba(100,80,50,0.18)] bg-ivory text-ink dark:border-white/15 dark:bg-white/5 dark:text-white",
      )}
    >
      <Clock size={compact ? 15 : 17} className={danger ? "animate-pulse text-danger" : ""} />
      {formatTime(left)}
    </div>
  );
}
