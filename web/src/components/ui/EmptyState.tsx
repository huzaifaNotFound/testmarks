/**
 * ui/EmptyState.tsx
 *
 * Structured empty / zero-data state component.
 * Replaces ad-hoc inline <p>No attempts yet...</p> patterns.
 */

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-10 text-center",
        className,
      )}
    >
      {/* Voxel illustration for empty state */}
      <div className="relative mb-2 h-20 w-20 overflow-hidden rounded-lg border border-black/[0.05] bg-white dark:border-white/10 dark:bg-white/[0.02]">
        <Image
          src="/illustrations/empty.png"
          alt="No data"
          fill
          className="object-cover opacity-85 dark:opacity-75"
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-black/60 dark:text-white/60">
          {title}
        </p>
        {description && (
          <p className="mt-1 text-xs text-black/40 dark:text-white/40">
            {description}
          </p>
        )}
      </div>

      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="btn-ghost btn-sm mt-1"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="btn-ghost btn-sm mt-1"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
