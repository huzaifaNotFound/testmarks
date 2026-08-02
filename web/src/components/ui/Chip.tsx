/**
 * ui/Chip.tsx
 *
 * Variant-aware chip / tag primitive.
 * Wraps the global .chip class with semantic variant support.
 *
 * Existing pages that use the .chip className directly are NOT changed.
 * This component is for NEW code going forward.
 *
 * Usage:
 *   <Chip>Default</Chip>
 *   <Chip variant="success" icon={CheckCircle}>Correct</Chip>
 *   <Chip variant="crimson" icon={BrainCircuit}>42 attempts</Chip>
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChipVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "crimson";

interface ChipProps {
  variant?: ChipVariant;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<ChipVariant, string> = {
  default: "chip",
  success: "chip-success",
  warning: "chip-warning",
  danger:  "chip-danger",
  info:    "chip-info",
  crimson: "chip-crimson",
};

export default function Chip({
  variant = "default",
  icon: Icon,
  children,
  className,
}: ChipProps) {
  return (
    <span className={cn(VARIANT_CLASSES[variant], className)}>
      {Icon && <Icon size={13} aria-hidden="true" />}
      {children}
    </span>
  );
}
