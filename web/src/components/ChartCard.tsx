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
          <h3 className="heading text-base sm:text-lg">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-black/50 dark:text-white/50">{subtitle}</p>}
        </div>
        {Icon && (
          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lgx text-white"
            style={{ background: accent }}
          >
            <Icon size={17} />
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
