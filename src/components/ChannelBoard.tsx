"use client";

import { ExternalLink, GitBranch, Satellite } from "lucide-react";

import { faNum } from "@/lib/fa";
import type { ChannelStat } from "@/lib/types";
import { Reveal, SectionHeading, Tilt } from "./ui";

export default function ChannelBoard({ channels, synced }: { channels: ChannelStat[]; synced: boolean }) {
  const sorted = [...channels].sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...sorted.map((c) => c.count));
  const total = sorted.reduce((s, c) => s + c.count, 0);

  return (
    <section id="channels" className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:py-24 md:px-6">
      <SectionHeading
        kicker="// TELEGRAM SOURCES"
        title="هشت منبع تلگرامی — کانال به کانال"
        desc="تعداد کانفیگ‌های فعالِ هر کانال در آرشیو‌ی جاری و سهمِ ۲۴ ساعت اخیرش. کلیک روی هر نام، پیش‌نمایش عمومی کانال را باز می‌کند."
      />

      {!synced || sorted.length === 0 ? (
        <Reveal>
          <Tilt intensity={3}>
            <div className="glass g-border card relative overflow-hidden rounded-3xl p-6 text-center sm:p-10">
              <div className="tilt-layer mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl border border-mint/25 bg-mint/5 text-mint">
                <Satellite size={28} />
              </div>
              <h3 className="text-xl font-black text-zinc-100">در انتظار اولین همگام‌سازی</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
                به‌محض اینکه GitHub Action چرخه‌ی اول را اجرا کند (<span className="font-mono text-mint" dir="ltr">cron: 5h</span>)،
                کانفیگ‌های ۲۴ ساعت اخیر کانال‌ها اینجا با تفکیک کانال نمایش داده می‌شوند.
              </p>
              <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-2.5 sm:grid-cols-4" dir="ltr">
                {["vpn_Click", "FreakConfig", "V2RAYROZ", "prrofile_purple", "V2rayBaaz", "V2rayNGX", "V2rayng_Fast", "v2ray26"].map(
                  (c) => (
                    <span key={c} className="pill pill-xs justify-center font-mono">
                      @{c}
                    </span>
                  ),
                )}
              </div>
            </div>
          </Tilt>
        </Reveal>
      ) : (
        <Tilt intensity={2.2}>
          <div className="glass g-border card overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between border-b hairline px-4 py-4 text-[11px] text-zinc-500 sm:px-6">
              <span>کانال تلگرام</span>
              <span className="flex items-center gap-8">
                <span className="hidden sm:inline">توزیع کانفیگ‌ها</span>
                <span>تعداد</span>
              </span>
            </div>
            <ul className="divide-y divide-white/[0.04]">
              {sorted.map((c, i) => (
                <li key={c.id}>
                  <Reveal delay={i * 60}>
                    <div className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.02] sm:gap-4 sm:px-6 sm:py-4">
                      <span
                        className={`dot shrink-0 ${c.ok ? "bg-mint text-mint" : "bg-rose-400 text-rose-400"}`}
                        title={c.ok ? "اسکن موفق" : `اسکن ناموفق: ${c.error ?? "خطا"}`}
                      />
                      <a
                        href={`https://t.me/s/${c.id}`}
                        target="_blank"
                        rel="noreferrer"
                        dir="ltr"
                        className="mono flex min-w-0 items-center gap-1.5 font-mono text-xs text-zinc-100 transition-colors group-hover:text-mint sm:text-sm"
                      >
                        <span className="truncate">@{c.id}</span>
                        <ExternalLink size={12} className="shrink-0 text-zinc-600 group-hover:text-mint" />
                      </a>
                      <div className="relative hidden h-2 flex-1 overflow-hidden rounded-full bg-white/[0.05] sm:block" dir="ltr">
                        <div
                          className="bar absolute inset-y-0 right-0 rounded-full bg-gradient-to-r from-mint/90 via-teal-400/80 to-viol/80"
                          style={{ width: `${Math.round((c.count / max) * 100)}%`, ["--rv-delay" as string]: `${i * 60}ms` }}
                        />
                        {c.fresh > 0 && (
                          <div
                            className="absolute inset-y-0 right-0 rounded-full bg-mint/40"
                            style={{ width: `${Math.round((Math.min(c.fresh, c.count) / max) * 100)}%` }}
                          />
                        )}
                      </div>
                      <div className="w-14 shrink-0 text-left sm:w-20" dir="ltr">
                        <span className="font-mono text-sm font-bold text-zinc-50 tabular sm:text-base">{faNum(c.count)}</span>
                        {c.fresh > 0 && <span className="block text-[10px] text-mint/80 tabular">+{faNum(c.fresh)} تازه</span>}
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t hairline bg-black/30 px-4 py-4 sm:px-6">
              <span className="mono flex items-center gap-2 font-mono text-[11px] tracking-widest text-zinc-500" dir="ltr">
                <GitBranch size={13} className="text-mint" />
                TOTAL = {faNum(total)}
              </span>
              <span className="text-[11px] text-zinc-500">چرخه‌ی نگهداری: ۴۸ ساعت</span>
            </div>
          </div>
        </Tilt>
      )}
    </section>
  );
}
