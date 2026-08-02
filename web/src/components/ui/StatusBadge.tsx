/**
 * ui/StatusBadge.tsx
 *
 * Small semantic status indicator — coloured dot + label.
 * Useful for: mastery levels, test result status, premium tier labels.
 *
 * Usage:
 *   <StatusBadge status="success" label="Strong" />
 *   <StatusBadge status="warning" label="Moderate" />
 *   <StatusBadge status="danger"  label="Needs work" />
 */

import { cn } from "@/lib/utils";

type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral" | "crimson";

interface StatusBadgeProps {
  status: StatusVariant;
  label: string;
  className?: string;
}

const DOT_COLOR: Record<StatusVariant, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger:  "bg-danger",
  info:    "bg-info",
  neutral: "bg-neutral",
  crimson: "bg-crimson",
};

const TEXT_COLOR: Record<StatusVariant, string> = {
  success: "text-success dark:text-green-400",
  warning: "text-warning-dark dark:text-amber-400",
  danger:  "text-danger dark:text-red-400",
  info:    "text-info-dark dark:text-sky-400",
  neutral: "text-neutral dark:text-slate-400",
  crimson: "text-crimson dark:text-crimson-light",
};

export default function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", className)}
    >
      <span
        className={cn("h-2 w-2 rounded-full", DOT_COLOR[status])}
        aria-hidden="true"
      />
      <span className={TEXT_COLOR[status]}>{label}</span>
    </span>
  );
}
