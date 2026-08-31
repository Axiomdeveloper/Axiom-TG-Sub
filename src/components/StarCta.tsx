import { MessageSquarePlus, Star } from "lucide-react";

import { Reveal, Tilt } from "./ui";

const REPO_URL =
  process.env.NEXT_PUBLIC_REPO_URL ?? "https://github.com/Axiomdeveloper/Axiom-TG-Sub";

export default function StarCta() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-24 pt-4 md:px-6">
      <Reveal>
        <Tilt intensity={3}>
          <div className="glass g-border card relative overflow-hidden rounded-[32px] px-6 py-14 text-center sm:px-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full bg-mint/10 blur-[90px]"
            />
            <span className="staranim tilt-layer relative inline-grid h-20 w-20 place-items-center rounded-3xl border border-amberx/30 bg-amberx/10 text-amberx">
              <Star size={38} strokeWidth={1.6} fill="currentColor" fillOpacity={0.25} />
            </span>
            <h2 className="relative mt-8 text-2xl font-black leading-snug text-zinc-50 sm:text-3xl">
              اگر پروژه بدردت خورد،
              <br />
              یک <span className="text-grad-mint">ستاره</span> به ریپو بده
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-8 text-zinc-400">
              ستاره‌ی گیت‌هاب (Star) رایگان است ولی باعث دیده‌شدن پروژه می‌شود — با آن، امکانات بعدی سریع‌تر می‌آیند:
              کانال‌های بیشتر، خروجی Clash و چند ساب هم‌زمان.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn btn-mint">
                <Star size={16} fill="currentColor" fillOpacity={0.3} />
                به ریپو ستار بده
              </a>
              <a href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <MessageSquarePlus size={15} />
                گزارش باگ یا درخواست کانال جدید
              </a>
            </div>
          </div>
        </Tilt>
      </Reveal>
    </section>
  );
}
