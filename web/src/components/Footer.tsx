import { Heart } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink-2 text-[#EDE8DF] border-t border-[rgba(100,80,50,0.15)] dark:border-none">
      <div className="container-px grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#EDE8DF]/60">
            AI-tutored mock tests for NEET, JEE Mains, JEE Advanced and CBSE. Practice,
            get coached, and track your progress to success.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["NEET", "JEE Mains", "JEE Adv", "CBSE 8", "CBSE 9", "CBSE 10"].map((s) => (
              <span key={s} className="chip border-white/10 text-[#EDE8DF]/75 font-semibold">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="label !text-[#EDE8DF]/40">Product</div>
          <ul className="mt-4 space-y-2.5 text-sm text-[#EDE8DF]/75">
            {["Diagnostic test", "AI mock tests", "Analytics hub", "Premium", "Admin"].map((x) => (
              <li key={x}>
                <a href="#" className="transition-colors hover:text-primary-light">
                  {x}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="label !text-[#EDE8DF]/40">Company</div>
          <ul className="mt-4 space-y-2.5 text-sm text-[#EDE8DF]/75">
            {["About", "Blog", "Careers", "Contact", "Privacy"].map((x) => (
              <li key={x}>
                <a href="#" className="transition-colors hover:text-primary-light">
                  {x}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-5 text-xs text-[#EDE8DF]/45 sm:flex-row">
          <span>© {new Date().getFullYear()} Test Marks AI. All rights reserved.</span>
          <span className="inline-flex items-center gap-1.5">
            Made with <Heart size={12} className="text-danger" fill="currentColor" /> for students
          </span>
        </div>
      </div>
    </footer>
  );
}
