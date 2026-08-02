import { Target } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-crimson text-white shadow-glow transition-transform group-hover:rotate-6">
        <Target size={18} />
      </span>
      <span className={cn("heading text-lg", dark ? "text-white" : "text-ink dark:text-white")}>
        Test Marks <span className="text-crimson">AI</span>
      </span>
    </Link>
  );
}
