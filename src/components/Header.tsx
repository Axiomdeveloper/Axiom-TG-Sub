"use client";

import { Radio } from "lucide-react";
import { useEffect, useState } from "react";

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.1 11.1 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

import { relTimeFa } from "@/lib/fa";

const LINKS = [
  { href: "#stats", label: "آمار زنده" },
  { href: "#channels", label: "کانال‌ها" },
  { href: "#connect", label: "اتصال" },
  { href: "#guide", label: "راهنما" },
];

const LOGO = (
  <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden>
    <defs>
      <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#00e0a4" />
        <stop offset="1" stopColor="#7c5cff" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="60" height="60" rx="16" fill="#06080f" />
    <rect x="2" y="2" width="60" height="60" rx="16" fill="none" stroke="url(#lg1)" strokeWidth="3" />
    <path d="M20 44 L32 18 L44 44" fill="none" stroke="#eafff7" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25.5 35.5 H38.5" stroke="url(#lg1)" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export default function Header({ synced, lastRun }: { synced: boolean; lastRun: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(id);
    };
  }, []);

  void now; // refresh relative labels periodically
  const repo = process.env.NEXT_PUBLIC_REPO_URL || "#repo";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass py-2 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)]" : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <a href="#top" className="flex items-center gap-3">
          {LOGO}
          <span className="flex flex-col leading-none">
            <span className="text-base font-black text-zinc-50" dir="ltr">
              Axiom TG
            </span>
            <span className="mt-1 font-mono text-[9px] tracking-[0.3em] text-mint/80" dir="ltr">
              AUTO·SUB·5H
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border hairline bg-black/25 px-1.5 py-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-1.5 text-[13px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <span className="pill hidden sm:inline-flex" title={lastRun ?? ""}>
            <span className={`dot ${synced ? "bg-mint text-mint" : "bg-amberx text-amberx"}`} />
            {synced ? `سینک: ${relTimeFa(lastRun)}` : "در انتظار اولین سینک"}
          </span>
          <a href={repo} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" title="Repository">
            <GithubIcon size={16} />
            <span className="hidden lg:inline">گیت‌هاب</span>
          </a>
          <a href="#connect" className="btn btn-mint btn-sm">
            <Radio size={16} />
            <span className="hidden sm:inline">دریافت ساب</span>
            <span className="sm:hidden">ساب</span>
          </a>
        </div>
      </div>
    </header>
  );
}
