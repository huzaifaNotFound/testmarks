import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Meridian Mark — geometric letterform using stacked horizontal bars
 * evoking layered knowledge / data strata. Clean, minimal, memorable.
 */
export default function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Stacked bar mark — four precision bars of decreasing width */}
        <rect x="4"  y="4"  width="20" height="5" rx="1.5" fill="var(--color-crimson)" />
        <rect x="4"  y="11.5" width="15" height="5" rx="1.5" fill="var(--color-crimson)" opacity="0.70" />
        <rect x="4"  y="19" width="10" height="5" rx="1.5" fill="var(--color-crimson)" opacity="0.40" />
      </svg>
      <span
        className={cn(
          "font-heading text-[15px] font-bold tracking-[-0.01em]",
          dark ? "text-white" : "text-ink dark:text-white"
        )}
      >
        Test Marks<span className="text-crimson">.</span>
        <span className="text-crimson font-extrabold">AI</span>
      </span>
    </Link>
  );
}
