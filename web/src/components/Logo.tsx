import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform group-hover:scale-105"
      >
        {/* Top Face */}
        <path d="M16 3L28 9L16 15L4 9L16 3Z" fill="var(--color-crimson)" opacity="0.85" />
        {/* Left Face */}
        <path d="M4 9L16 15V29L4 23V9Z" fill="var(--color-crimson-deep)" />
        {/* Right Face */}
        <path d="M16 15L28 9V23L16 29V15Z" fill="var(--color-crimson-dark)" />
        
        {/* Inner Target Point (subtle voxel detail) */}
        <path d="M16 9L21 11.5L16 14L11 11.5L16 9Z" fill="#FFF" opacity="0.9" />
      </svg>
      <span className={cn("heading text-lg font-bold tracking-tight", dark ? "text-white" : "text-ink dark:text-white")}>
        Test Marks <span className="text-crimson font-extrabold">AI</span>
      </span>
    </Link>
  );
}
