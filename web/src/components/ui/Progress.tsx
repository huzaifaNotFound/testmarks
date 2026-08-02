/**
 * ui/Progress.tsx
 *
 * Accessible progressbar primitive.
 */

import { cn } from "@/lib/utils";

type ProgressVariant = "default" | "success" | "warning" | "danger";
type ProgressSize    = "sm" | "md" | "lg";

interface ProgressProps {
  /** Current value (numeric). Percentage = value / max * 100. */
  value: number;
  /** Maximum value. Defaults to 100 so you can pass a percentage directly. */
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  /** Accessible label for screen readers. */
  label?: string;
  className?: string;
}

const TRACK_SIZE: Record<ProgressSize, string> = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

const BAR_COLOR: Record<ProgressVariant, string> = {
  default: "bg-primary",
  success: "bg-forest",
  warning: "bg-accent",
  danger:  "bg-danger",
};

export default function Progress({
  value,
  max = 100,
  variant = "default",
  size = "md",
  label,
  className,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn(
        "w-full overflow-hidden rounded-pill bg-[rgba(100,80,50,0.10)] dark:bg-white/10",
        TRACK_SIZE[size],
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-pill transition-all duration-700",
          BAR_COLOR[variant],
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
