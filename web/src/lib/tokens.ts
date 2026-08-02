/**
 * lib/tokens.ts
 * JS-accessible design constants that mirror globals.css @theme tokens.
 */

import { normalizeMastery } from "./utils";

export interface MasteryLevel {
  bg: string;
  label: string;
}

export const MASTERY_LEVELS = {
  high:     { bg: "#2D6A4F", label: "Strong"     },  // ≥ 80%
  good:     { bg: "#52B788", label: "Good"       },  // ≥ 60%
  moderate: { bg: "#C8952A", label: "Moderate"   },  // ≥ 40%
  weak:     { bg: "#D4762A", label: "Developing" },  // ≥ 20%
  low:      { bg: "#B94040", label: "Needs work" },  //  < 20%
} as const satisfies Record<string, MasteryLevel>;

export function getMasteryLevel(accuracy: number): MasteryLevel {
  const norm = normalizeMastery(accuracy);
  if (norm >= 0.8) return MASTERY_LEVELS.high;
  if (norm >= 0.6) return MASTERY_LEVELS.good;
  if (norm >= 0.4) return MASTERY_LEVELS.moderate;
  if (norm >= 0.2) return MASTERY_LEVELS.weak;
  return MASTERY_LEVELS.low;
}

export function getMasteryColor(accuracy: number): string {
  return getMasteryLevel(accuracy).bg;
}

// ── Stream accent palette ──────────────────────────────────────────
export const STREAM_ACCENTS: Record<string, string> = {
  neet:      "#3D3580",  // deep indigo
  jee_mains: "#2D5A8E",  // slate blue
  jee_adv:   "#2D6A4F",  // forest green
  cbse:      "#C8952A",  // warm gold
};

export function getStreamAccent(streamId: string): string {
  return STREAM_ACCENTS[streamId] ?? "#3D3580";
}

// ── Chart colour palette ───────────────────────────────────────────
export const CHART_COLORS = {
  primary:   "#3D3580",  // deep indigo
  secondary: "#2D6A4F",  // forest green
  tertiary:  "#C8952A",  // warm gold
  success:   "#2D6A4F",
  warning:   "#C8952A",
  neutral:   "#8A8272",
} as const;

// ── Semantic UI colours ────────────────────────────────────────────
export const SEMANTIC_COLORS = {
  success: "#2D6A4F",
  warning: "#C8952A",
  danger:  "#B94040",
  info:    "#2D5A8E",
  neutral: "#8A8272",
  crimson: "#3D3580",   // legacy compat
  primary: "#3D3580",
} as const;
