/**
 * ui/Skeleton.tsx
 *
 * Shimmer loading state primitives.
 *
 * Usage:
 *   <Skeleton className="h-8 w-48" />          // generic block
 *   <SkeletonText lines={3} />                  // multi-line text
 *   <SkeletonCard />                            // full card placeholder
 *   <SkeletonStatCard />                        // stat card placeholder
 */

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ── Base skeleton block ────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("skeleton", className)}
    />
  );
}

// ── Multi-line text skeleton ───────────────────────────────────────────────

interface SkeletonTextProps {
  /** Number of lines to render. Defaults to 3. */
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3.5 rounded",
            // Last line is shorter for a natural look
            i === lines - 1 ? "w-3/4" : "w-full",
          )}
        />
      ))}
    </div>
  );
}

// ── Full card skeleton ─────────────────────────────────────────────────────

interface SkeletonCardProps {
  className?: string;
  children?: ReactNode;
}

export function SkeletonCard({ className, children }: SkeletonCardProps) {
  return (
    <div
      className={cn("card p-5 sm:p-6", className)}
      aria-hidden="true"
    >
      {children ?? (
        <>
          <Skeleton className="mb-4 h-5 w-32" />
          <SkeletonText lines={3} />
        </>
      )}
    </div>
  );
}

// ── Stat card skeleton ─────────────────────────────────────────────────────

export function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div className={cn("card p-5 sm:p-6", className)} aria-hidden="true">
      <Skeleton className="mb-3 h-10 w-10 rounded-lgx" />
      <Skeleton className="mb-2 h-9 w-24" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

// Default export — the base skeleton block
export default Skeleton;
