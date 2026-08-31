"use client";

import { Check, Copy, SatelliteDish } from "lucide-react";
import { useEffect, useState } from "react";

import { faNum } from "@/lib/fa";
import { ParallaxLayer, Reveal } from "./ui";

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
    <div className="glass g-border flex w-full max-w-xl items-center gap-2 rounded-full p-2 ps-3 sm:ps-4">
      <span className="dot bg-mint text-mint" />
      <span dir="ltr" className="mono min-w-0 flex-1 truncate font-mono text-[11px] text-emerald-100/90 sm:text-sm">
        {url || "…"}
      </span>
      <button type="button" onClick={copy} className="btn btn-mint btn-xs sm:btn-sm shrink-0" aria-live="polite">
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? "کپی شد" : "کپی ساب"}
      </button>
    </div>
  );
}

/** Depth-floated config cards orbiting the hero — the 3D layer. */
function FloatingCards() {
  return (
    <>
      <ParallaxLayer
        depth={18}
        className="pointer-events-none absolute left-[1%] top-[26%] z-0 hidden w-64 lg:block xl:left-[4%]"
      >
        <div className="glass g-border float-card -rotate-6 rounded-2xl p-4 animate-float" dir="ltr">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-widest text-mint">VLESS · REALITY</span>
            <span className="dot bg-mint text-mint" />
          </div>
          <p className="mt-3 break-all font-mono text-[10.5px] leading-5 text-zinc-400" dir="ltr">
            vless://9f42…@cdn.axiom.net:443?security=reality&amp;flow=xtls-rprx-vision
            <span className="text-mint">#Axiom%20TG</span>
          </p>
        </div>
      </ParallaxLayer>

      <ParallaxLayer
        depth={26}
        className="pointer-events-none absolute right-[0%] top-[58%] z-0 hidden w-60 lg:block xl:right-[3%]"
      >
        <div
          className="glass g-border float-card rotate-[7deg] rounded-2xl p-4 animate-float"
          style={{ animationDelay: "-4s" }}
          dir="ltr"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-widest text-viol">TROJAN · TLS</span>
            <span className="dot bg-viol text-viol" />
          </div>
          <p className="mt-3 break-all font-mono text-[10.5px] leading-5 text-zinc-400" dir="ltr">
            trojan://p@edge.axiom.net:8443?sni=edge&amp;type=ws
            <span className="text-viol">#Axiom%20TG</span>
          </p>
        </div>
      </ParallaxLayer>

      <ParallaxLayer
        depth={34}
        className="pointer-events-none absolute right-[6%] top-[20%] z-0 hidden lg:block"
      >
        <div
          className="glass g-border float-card rotate-3 rounded-full px-4 py-2 animate-float"
          style={{ animationDelay: "-7s" }}
          dir="ltr"
        >
          <span className="font-mono text-[10px] tracking-widest text-amberx">48H · AUTO-PRUNE</span>
        </div>
      </ParallaxLayer>
    </>
  );
}

export default function Hero({ total, synced, channels }: { total: number; synced: boolean; channels: string[] }) {
  return (
    <section
      id="top"
      className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-4 pb-10 pt-24 text-center sm:min-h-[96svh] sm:pt-28"
    >
      <FloatingCards />

      {/* giant latin ghost — drifts opposite to cursor for depth */}
      <ParallaxLayer
        depth={-14}
        className="pointer-events-none absolute inset-x-0 top-[14%] select-none text-center sm:top-[13%]"
      >
        <span className="ghost-en font-mono font-bold text-[clamp(3.4rem,16vw,12rem)] leading-none" dir="ltr">
          AXIOM
        </span>
      </ParallaxLayer>

      <Reveal className="relative z-10 flex w-full flex-col items-center">
        <p className="pill mb-5 font-mono sm:mb-6" dir="ltr">
          <SatelliteDish size={13} className="text-mint" />
          telegram → v2ray · refresh every 5h
        </p>

        <h1 className="max-w-4xl text-[clamp(2rem,7vw,4.6rem)] font-black leading-[1.16] text-zinc-50">
          اشتراک زنده‌ی <span className="text-grad-mint">V2Ray</span>
          <br />
          از قلبِ <span className="text-grad-viol">کانال‌های تلگرام</span>
        </h1>

        <p className="mt-5 max-w-2xl text-[13px] leading-7 text-zinc-400 sm:mt-6 sm:text-base sm:leading-8">
          هر <b className="text-zinc-200">۵ ساعت</b> به‌صورت خودکار، کانفیگ‌های <b className="text-zinc-200">۲۴ ساعت اخیر</b>{" "}
          هشت کانال تلگرامی استخراج، یکدست به <span className="font-mono text-mint" dir="ltr">Axiom TG</span> تغییر نام و در یک
          ساب واحد منتشر می‌شوند؛ کانفیگ‌ها پس از <b className="text-zinc-200">۴۸ ساعت</b> خودکار دور ریخته می‌شوند.
        </p>

        <div className="mt-8 flex w-full max-w-xl justify-center sm:mt-9">
          <SubPill />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500 sm:mt-7">
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
      <div className="marquee-mask absolute inset-x-0 bottom-6 z-10 overflow-hidden opacity-70 sm:bottom-8">
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
