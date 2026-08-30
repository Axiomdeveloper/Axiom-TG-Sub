"use client";

import { Check, Copy, SatelliteDish } from "lucide-react";
import { useEffect, useState } from "react";

import { faNum } from "@/lib/fa";
import { Reveal } from "./ui";

const PROTOCOLS = ["VLESS", "VMess", "Trojan", "Shadowsocks", "SSR", "TUIC", "Hysteria2", "Reality", "WireGuard", "Snell"];

function SubPill() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/api/sub`);
  }, []);

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="glass g-border flex w-full max-w-xl items-center gap-2 rounded-full p-2 ps-4">
      <span className="dot bg-mint text-mint shrink-0" />
      <span dir="ltr" className="mono flex-1 truncate font-mono text-xs text-emerald-100/90 sm:text-sm">
        {url || "…"}
      </span>
      <button onClick={copy} className="btn btn-mint btn-xs shrink-0" aria-live="polite">
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? "کپی شد" : "کپی ساب"}
      </button>
    </div>
  );
}

export default function Hero({ total, synced, channels }: { total: number; synced: boolean; channels: string[] }) {
  return (
    <section id="top" className="relative flex min-h-[96svh] flex-col items-center justify-center px-4 pt-28 pb-10 text-center">
      {/* giant latin ghost */}
      <div className="pointer-events-none absolute inset-x-0 top-[16%] select-none text-center">
        <span className="ghost-en font-mono font-bold text-[clamp(4rem,16vw,12rem)] leading-none" dir="ltr">
          AXIOM
        </span>
      </div>

      <Reveal className="relative z-10 flex flex-col items-center">
        <p className="pill mb-6 font-mono" dir="ltr">
          <SatelliteDish size={13} className="text-mint" />
          telegram → v2ray · refresh every 5h
        </p>

        <h1 className="max-w-4xl text-[clamp(2.3rem,7vw,4.6rem)] font-black leading-[1.12] text-zinc-50">
          اشتراک زنده‌ی <span className="text-grad-mint">V2Ray</span>
          <br />
          از قلبِ <span className="text-grad-viol">کانال‌های تلگرام</span>
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-8 text-zinc-400 md:text-base md:leading-8">
          هر <b className="text-zinc-200">۵ ساعت</b> به‌صورت خودکار، کانفیگ‌های <b className="text-zinc-200">۲۴ ساعت اخیر</b>{" "}
          هشت کانال تلگرامی استخراج، یکدست به <span className="font-mono text-mint" dir="ltr">Axiom TG</span> تغییر نام و در یک
          ساب واحد منتشر می‌شوند؛ کانفیگ‌ها پس از <b className="text-zinc-200">۴۸ ساعت</b> خودکار دور ریخته می‌شوند.
        </p>

        <div className="mt-9 flex w-full max-w-xl justify-center">
          <SubPill />
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500">
          <span className="pill">{faNum(channels.length)} کانال فعال</span>
          <span className="pill">به‌روزرسانی: هر ۵ ساعت</span>
          <span className="pill">نگهداری: ۴۸ ساعت</span>
          {synced ? (
            <span className="pill text-mint" dir="rtl">
              {faNum(total)} کانفیگ همین حالا داخل ساب
            </span>
          ) : (
            <span className="pill text-amberx">منتظر اولین سینک گیت‌هاب اکشن</span>
          )}
        </div>
      </Reveal>

      {/* protocol marquee */}
      <div className="marquee-mask absolute inset-x-0 bottom-8 z-10 overflow-hidden opacity-70">
        <div className="marquee-track">
          {[...PROTOCOLS, ...PROTOCOLS, ...PROTOCOLS, ...PROTOCOLS].map((p, i) => (
            <span key={i} className="pill pill-s font-mono text-zinc-400" dir="ltr">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
