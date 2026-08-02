/**
 * ui/PageHeader.tsx
 *
 * Standard page title + subtitle + optional right-slot actions.
 * Provides a consistent visual pattern going forward.
 *
 * Existing pages keep their current heading JSX — this is for NEW code.
 *
 * Usage:
 *   <PageHeader title="Dashboard" subtitle="Welcome back" />
 *
 *   <PageHeader
 *     title="Analytics"
 *     subtitle="Your performance over time"
 *     actions={<Link href="/mock-test" className="btn-primary">New test</Link>}
 *   />
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-3",
        className,
      )}
    >
      <div>
        <h1 className="heading text-2xl sm:text-3xl">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
