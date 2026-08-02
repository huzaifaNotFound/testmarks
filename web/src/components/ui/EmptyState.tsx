/**
 * ui/EmptyState.tsx
 *
 * Structured empty / zero-data state component.
 * Replaces ad-hoc inline <p>No attempts yet...</p> patterns.
 *
 * Usage:
 *   <EmptyState
 *     icon={ClipboardList}
 *     title="No attempts yet"
 *     description="Take your first mock test to see results here."
 *     action={{ label: "Start a test", href: "/mock-test" }}
 *   />
 *
 *   // With button action instead of link:
 *   <EmptyState
 *     title="No data available"
 *     action={{ label: "Refresh", onClick: () => refetch() }}
 *   />
 */

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
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
        "flex flex-col items-center justify-center gap-3 py-12 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-card bg-black/[0.04] text-black/30 dark:bg-white/[0.06] dark:text-white/30">
          <Icon size={22} aria-hidden="true" />
        </span>
      )}

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
