import { Heart } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="container-px grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            AI-tutored mock tests for NEET, JEE Mains, JEE Advanced and CBSE. Practice,
            get coached, and track your climb to the top.
          </p>
          <div className="mt-6 flex gap-2">
            {["NEET", "JEE Mains", "JEE Adv", "CBSE 8", "CBSE 9", "CBSE 10"].map((s) => (
              <span key={s} className="chip border-white/15 text-white/70">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="label !text-white/40">Product</div>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {["Diagnostic test", "AI mock tests", "Analytics hub", "Premium", "Admin"].map((x) => (
              <li key={x}>
                <a href="#" className="transition-colors hover:text-crimson-light">
                  {x}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="label !text-white/40">Company</div>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {["About", "Blog", "Careers", "Contact", "Privacy"].map((x) => (
              <li key={x}>
                <a href="#" className="transition-colors hover:text-crimson-light">
                  {x}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/45 sm:flex-row">
          <span>© {new Date().getFullYear()} Test Marks AI. All rights reserved.</span>
          <span className="inline-flex items-center gap-1.5">
            Made with <Heart size={12} className="text-crimson" fill="currentColor" /> for students
          </span>
        </div>
      </div>
    </footer>
  );
}
