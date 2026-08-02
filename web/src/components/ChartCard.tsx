import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function ChartCard({
  title,
  subtitle,
  icon: Icon,
  children,
  className,
  accent = "#DC143C",
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div className={cn("card p-5 sm:p-6", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="heading text-sm sm:text-base text-ink dark:text-white font-semibold">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-black/45 dark:text-white/45">{subtitle}</p>}
        </div>
        {Icon && (
          <span
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.06] bg-black/[0.02] dark:border-white/[0.06] dark:bg-white/[0.02]"
            style={{ color: accent }}
          >
            <Icon size={15} />
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
