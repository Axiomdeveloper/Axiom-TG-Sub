"use client";

import { Activity, Layers, RefreshCw, Satellite, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { faDateTime, faNum, relTimeFa } from "@/lib/fa";
import { CountUp, Reveal, SectionHeading, Tilt } from "./ui";

interface Props {
  total: number;
  fresh24h: number;
  channelsOk: number;
  channelsTotal: number;
  lastRun: string | null;
  nextRun: string | null;
  synced: boolean;
}

function SyncCountdown({ lastRun, nextRun, synced }: { lastRun: string | null; nextRun: string | null; synced: boolean }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  const lastTs = lastRun ? new Date(lastRun).getTime() : null;
  const nextTs = nextRun ? new Date(nextRun).getTime() : null;
  let pct = 0;
  if (lastTs && nextTs && now) {
    pct = Math.max(0, Math.min(100, ((now - lastTs) / Math.max(1, nextTs - lastTs)) * 100));
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between text-[11px] text-zinc-500">
        <span>آخرین سینک: {synced ? relTimeFa(lastRun) : "—"}</span>
        <span dir="ltr">{synced ? `${Math.round(pct)}%` : ""}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]" dir="ltr">
        <div
          className="h-full rounded-full bg-gradient-to-r from-mint to-viol transition-[width] duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] text-zinc-500">
        {synced && nextRun ? <>سینک بعدی: <b className="text-zinc-300">{relTimeFa(nextRun)}</b> (حدودی)</> : "اولین سینک به‌زودی…"}
      </p>
    </div>
  );
}

export default function StatsBento({ total, fresh24h, channelsOk, channelsTotal, lastRun, nextRun, synced }: Props) {
  const cards = [
    {
      icon: Layers,
      accent: "mint",
      label: "مجموع کانفیگ‌های ساب",
      value: total,
      sub: synced ? "فعال در آرشیو‌ی ۴۸ ساعته" : "در انتظار اولین سینک",
    },
    {
      icon: Zap,
      accent: "vi",
      label: "تازه‌های ۲۴ ساعت اخیر",
      value: fresh24h,
      sub: "استخراج‌شده از آخرین پست‌های کانال‌ها",
    },
    {
      icon: Satellite,
      accent: "mint",
      label: "کانال‌های سالم",
      value: synced ? channelsOk : 0,
      sub: synced ? `از ${faNum(channelsTotal)} کانال تلگرامی در آخرین اسکن` : "پس از اولین سینک نمایش داده می‌شود",
    },
  ];

  return (
    <section id="stats" className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:py-24 md:px-6">
      <SectionHeading
        kicker="// LIVE STATS"
        title="آمار زنده‌ی شبکه"
        desc="داده‌ها مستقیم از آخرین خروجی GitHub Action خوانده می‌شوند."
      />

      <div className="p3d grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 90}>
            <Tilt intensity={7}>
              <div className="glass card g-border h-full rounded-3xl p-6">
                <div
                  className={`tilt-layer mb-5 inline-flex rounded-2xl border p-2.5 ${
                    c.accent === "mint" ? "border-mint/25 text-mint bg-mint/5" : "border-viol/25 text-viol bg-viol/5"
                  }`}
                >
                  <c.icon size={20} />
                </div>
                <p className="font-mono text-3xl font-bold text-zinc-50 sm:text-4xl" dir="ltr">
                  <CountUp value={c.value} />
                </p>
                <p className="mt-3 text-sm font-bold text-zinc-200">{c.label}</p>
                <p className="mt-1.5 text-xs leading-5 text-zinc-500">{c.sub}</p>
              </div>
            </Tilt>
          </Reveal>
        ))}

        <Reveal delay={270}>
          <Tilt intensity={7}>
            <div className="glass card g-border h-full rounded-3xl p-6">
              <div className="tilt-layer mb-5 inline-flex rounded-2xl border border-amberx/25 bg-amberx/5 p-2.5 text-amberx">
                <RefreshCw size={20} />
              </div>
              <p className="flex items-center gap-2 text-sm font-bold text-zinc-200">
                <Activity size={14} className="text-amberx" />
                چرخه‌ی سینک خودکار
              </p>
              <p className="mt-1.5 text-xs text-zinc-500" title={lastRun ? faDateTime(lastRun) : ""}>
                {synced ? faDateTime(lastRun) : "هنوز سینکی ثبت نشده"}
              </p>
              <SyncCountdown lastRun={lastRun} nextRun={nextRun} synced={synced} />
            </div>
          </Tilt>
        </Reveal>
      </div>
    </section>
  );
}
