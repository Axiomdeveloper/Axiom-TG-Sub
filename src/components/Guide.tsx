import { Clock, GitCommitHorizontal, Radio, RefreshCcw, SatelliteDish, Tag, TerminalSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Reveal, SectionHeading } from "./ui";

const PIPELINE: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: SatelliteDish,
    title: "اسکن هر ۵ ساعت",
    desc: "GitHub Action صفحه‌ی عمومی t.me/s هر ۸ کانال را می‌خواند",
  },
  {
    icon: Clock,
    title: "پنجره‌ی ۲۴ ساعته",
    desc: "فقط پست‌های یک شبانه‌روز اخیر وارد چرخه می‌شوند",
  },
  {
    icon: Tag,
    title: "ری‌نیم به Axiom TG",
    desc: "نام همه‌ی کانفیگ‌ها (fragment و ps در VMess) یکدست می‌شود",
  },
  {
    icon: RefreshCcw,
    title: "آرشیو ۴۸ ساعته",
    desc: "کانفیگ‌هایی که دو روز از کشف‌شان گذشته خودکار حذف می‌شوند",
  },
  {
    icon: GitCommitHorizontal,
    title: "انتشار خودکار",
    desc: "ساب + آمار در مخزن کامیت و به این داشبورد پوش می‌شود",
  },
];

const STEPS: { n: string; title: string; desc: string }[] = [
  {
    n: "۱",
    title: "کلاینت را نصب کنید",
    desc: "v2rayNG اندروید، Hiddify از روی گیت‌هاب، یا Streisand/FoXray برای iOS.",
  },
  {
    n: "۲",
    title: "ساب را اضافه کنید",
    desc: "در بخش Subscription لینک /api/sub را با نام «Axiom TG» ثبت کنید.",
  },
  {
    n: "۳",
    title: "رفرش کنید و متصل شوید",
    desc: "هر بار Update subscription بزنید، کانفیگ‌های تازه‌ی ۲۴ ساعت اخیر می‌پرد داخل.",
  },
];

export default function Guide() {
  return (
    <section id="guide" className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24 md:px-6">
      <SectionHeading
        kicker="// PIPELINE"
        title="خط لوله‌ی کاملاً خودکار"
        desc="بدون سرور همیشه‌روشن — فقط یک وورک‌فلوی GitHub Actions که هر ۵ ساعت بیدار می‌شود."
      />

      <div className="grid gap-4 md:grid-cols-5">
        {PIPELINE.map((p, i) => (
          <Reveal key={p.title} delay={i * 80}>
            <div className="glass card relative h-full rounded-3xl border hairline p-5 text-center">
              <span className="absolute -top-3 right-5 rounded-full border hairline bg-void px-2.5 py-0.5 font-mono text-[10px] text-mint" dir="ltr">
                {`0${i + 1}`}
              </span>
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-mint/20 bg-mint/5 text-mint">
                <p.icon size={20} />
              </div>
              <h3 className="text-sm font-black text-zinc-100">{p.title}</h3>
              <p className="mt-2 text-[11px] leading-5 text-zinc-500">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="glass g-border h-full rounded-3xl p-7">
            <h3 className="flex items-center gap-2.5 text-lg font-black text-zinc-100">
              <Radio size={18} className="text-mint" />
              اتصال در سه حرکت
            </h3>
            <ol className="mt-6 space-y-5">
              {STEPS.map((s) => (
                <li key={s.n} className="flex items-start gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-viol/30 bg-viol/10 text-base font-black text-viol">
                    {s.n}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-zinc-100">{s.title}</p>
                    <p className="mt-1 text-xs leading-6 text-zinc-500">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="glass g-border h-full rounded-3xl p-7">
            <h3 className="flex items-center gap-2.5 text-lg font-black text-zinc-100">
              <TerminalSquare size={18} className="text-viol" />
              سلف‌هاست با گیت‌هاب
            </h3>
            <p className="mt-3 text-xs leading-6 text-zinc-500">
              همین پروژه قابل fork است؛ فقط سه مقدار → کی، آدرس اپ، و نمک رهگیری:
            </p>
            <div dir="ltr" className="mt-5 overflow-x-auto rounded-2xl border hairline bg-black/50 p-4 font-mono text-[12px] leading-7 text-zinc-300">
              <p><span className="text-viol"># secrets</span></p>
              <p>INGEST_SECRET=<span className="text-mint">"your-long-random-token"</span></p>
              <p><span className="text-viol"># variables</span></p>
              <p>APP_URL=<span className="text-mint">"https://your-app.vercel.app"</span></p>
              <p className="mt-2 text-zinc-500"><span className="text-viol"># .github/workflows/axiom-update.yml</span></p>
              <p>cron: <span className="text-amberx">"7 */5 * * *"</span></p>
            </div>
            <p className="mt-5 rounded-2xl border border-mint/15 bg-mint/5 p-4 text-[11px] leading-6 text-emerald-100/80">
              حتی بدون داشبورد، ساب از مسیر خام گیت‌هاب در دسترس است:
              <code dir="ltr" className="mt-2 block font-mono text-[10.5px] text-mint/90">
                raw.githubusercontent.com/USER/REPO/main/sub/axiom_sub.txt
              </code>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
