/**
 * lib/tokens.ts
 *
 * JS-accessible design constants that mirror the CSS @theme tokens in globals.css.
 * Use these wherever you need token values in component logic (e.g. Recharts colours,
 * inline SVG strokes, dynamic className generation based on data values).
 *
 * Do NOT use raw hex strings in component files — import from here instead.
 */

import { normalizeMastery } from "./utils";

// ── Mastery color scale ────────────────────────────────────────────────────
// Single source of truth for topic accuracy thresholds.
// Used by: HeatmapGrid (dashboard), mastery heatmap (analytics), ScoreRing.

export interface MasteryLevel {
  bg: string;
  label: string;
}

export const MASTERY_LEVELS = {
  high:     { bg: "#16a34a", label: "Strong"      },   // ≥ 80 %
  good:     { bg: "#65a30d", label: "Good"        },   // ≥ 60 %
  moderate: { bg: "#f59e0b", label: "Moderate"    },   // ≥ 40 %
  weak:     { bg: "#f97316", label: "Developing"  },   // ≥ 20 %
  low:      { bg: "#ef4444", label: "Needs work"  },   //  < 20 %
} as const satisfies Record<string, MasteryLevel>;

/** Returns the mastery level object for a given accuracy value (0–1 or 0–100). */
export function getMasteryLevel(accuracy: number): MasteryLevel {
  const norm = normalizeMastery(accuracy);
  if (norm >= 0.8) return MASTERY_LEVELS.high;
  if (norm >= 0.6) return MASTERY_LEVELS.good;
  if (norm >= 0.4) return MASTERY_LEVELS.moderate;
  if (norm >= 0.2) return MASTERY_LEVELS.weak;
  return MASTERY_LEVELS.low;
}

/** Returns just the hex background colour for a given accuracy value. */
export function getMasteryColor(accuracy: number): string {
  return getMasteryLevel(accuracy).bg;
}

// ── Stream accent palette ──────────────────────────────────────────────────
// Accent colours for each exam stream. Used by StreamCard, StatCard accent prop.

export const STREAM_ACCENTS: Record<string, string> = {
  neet:     "#dc143c",
  jee_mains: "#0ea5e9",
  jee_adv:  "#8b5cf6",
  cbse:     "#16a34a",
};

/** Returns the accent hex for a given stream id, falling back to crimson. */
export function getStreamAccent(streamId: string): string {
  return STREAM_ACCENTS[streamId] ?? "#dc143c";
}

// ── Chart colour palette ───────────────────────────────────────────────────
// Consistent colours for all Recharts instances.

export const CHART_COLORS = {
  primary:   "#dc143c",
  secondary: "#0ea5e9",
  tertiary:  "#8b5cf6",
  success:   "#16a34a",
  warning:   "#f59e0b",
  neutral:   "#64748b",
} as const;

// ── Semantic UI colours (mirrors CSS tokens) ───────────────────────────────

export const SEMANTIC_COLORS = {
  success: "#16a34a",
  warning: "#f59e0b",
  danger:  "#ef4444",
  info:    "#0ea5e9",
  neutral: "#64748b",
  crimson: "#dc143c",
} as const;
