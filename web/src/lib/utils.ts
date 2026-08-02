import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return iso;
  }
}

/**
 * Defensive normalization for accuracy / mastery values.
 * Returns a normalized ratio between 0.0 and 1.0.
 *
 * Handles:
 * - Ratios (0.0 – 1.0): e.g. 0.85 -> 0.85
 * - Percentages (1.0 – 100.0): e.g. 85 -> 0.85
 * - Erroneous double-multiplied values (> 100): e.g. 8500 -> 0.85, 10000 -> 1.0
 * - Invalid / NaN / negative values: fallback to 0.0
 */
export function normalizeMastery(val: number | null | undefined): number {
  if (val === null || val === undefined || isNaN(val) || !isFinite(val)) return 0;
  let v = Number(val);
  if (v < 0) return 0;
  if (v > 100) {
    v = v / 100;
  }
  if (v > 1) {
    v = v / 100;
  }
  return Math.min(1, Math.max(0, v));
}

/**
 * Formats a raw accuracy/mastery value safely as an integer percentage string (0–100).
 * Guaranteed to never produce > 100 or broken numbers like 10000.
 */
export function formatMasteryPercent(val: number | null | undefined): string {
  const norm = normalizeMastery(val);
  return `${Math.round(norm * 100)}`;
}

export function pct(n: number) {
  return `${formatMasteryPercent(n)}%`;
}
