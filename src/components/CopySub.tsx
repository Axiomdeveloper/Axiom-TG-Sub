"use client";

import { Check, Copy, Download, ExternalLink, QrCode } from "lucide-react";
import { useEffect, useState } from "react";

import { Reveal, SectionHeading, Tilt } from "./ui";

const CLIENTS = [
  { name: "v2rayNG", platform: "Android" },
  { name: "PattNG", platform: "Windows" },
  { name: "PattNG Mobile", platform: "Android" },
  { name: "Hiddify", platform: "همه‌ی پلتفرم‌ها" },
  { name: "Streisand / FoXray", platform: "iOS" },
  { name: "NekoBox", platform: "Android / PC" },
  { name: "V2Box / Shadowrocket", platform: "iOS" },
];

export default function CopySub() {
  const [origin, setOrigin] = useState("");
  const [format, setFormat] = useState<"base64" | "plain">("base64");
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const subUrl = `${origin}/api/sub${format === "plain" ? "?format=plain" : ""}`;

  useEffect(() => {
    if (!origin) return;
    let alive = true;
    import("qrcode").then((QR) => {
      QR.toDataURL(`${origin}/api/sub`, {
        width: 480,
        margin: 2,
        color: { dark: "#07110d", light: "#eafff7" },
        errorCorrectionLevel: "M",
      })
        .then((png) => alive && setQr(png))
        .catch(() => undefined);
    });
    return () => {
      alive = false;
    };
  }, [origin]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(subUrl);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = subUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="connect" className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:py-24 md:px-6">
      <SectionHeading
        kicker="// CONNECT"
        title="لینک ساب را به کلاینت خود بدهید"
        desc="آدرس را در بخش Subscription کلاینت وارد کنید؛ کلاینت‌ها خودشان هر چند ساعت لیست را تازه می‌کنند — شما همیشه کانفیگ تازه با نام Axiom TG خواهید داشت."
      />

      <div className="p3d grid gap-5 sm:gap-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <Tilt intensity={3.4}>
            <div className="glass g-border card h-full rounded-3xl p-5 sm:p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-zinc-200">آدرس اشتراک</p>
                <div className="flex rounded-full border hairline bg-black/30 p-1 text-[11px] font-mono" dir="ltr">
                  {(["base64", "plain"] as const).map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`rounded-full px-3 py-1 transition-all ${
                        format === f ? "bg-mint text-[#03120c] font-bold" : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div
                dir="ltr"
                className="mt-4 flex items-center gap-2 overflow-x-auto rounded-2xl border hairline bg-black/40 px-3.5 py-3 font-mono text-[11.5px] text-emerald-100/90 sm:px-4 sm:py-3.5 sm:text-[13px]"
              >
                <span className="shrink-0 text-mint">➜</span>
                <code className="whitespace-nowrap" dir="ltr">{subUrl || "…"}</code>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <button type="button" onClick={copy} className="btn btn-mint">
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "کپی شد" : "کپی لینک"}
                </button>
                <button type="button" onClick={() => setShowQr((v) => !v)} className="btn btn-ghost">
                  <QrCode size={15} />
                  {showQr ? "بستن QR" : "نمایش QR"}
                </button>
                <a href={subUrl || "#"} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  <ExternalLink size={15} />
                  بازکردن خام
                </a>
                <a href={`${subUrl || "#"}`} download="axiom_tg_sub.txt" className="btn btn-ghost" title="دانلود فایل ساب">
                  <Download size={15} />
                  دانلود
                </a>
              </div>

              <div className={`grid transition-all duration-700 ${showQr ? "mt-6 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                    <div className="g-border rounded-3xl bg-white/[0.03] p-3">
                      {qr ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={qr} alt="Axiom TG subscription QR" className="h-36 w-36 rounded-2xl" width={144} height={144} />
                      ) : (
                        <div className="grid h-36 w-36 place-items-center text-xs text-zinc-500">…</div>
                      )}
                    </div>
                    <p className="max-w-xs text-xs leading-6 text-zinc-400">
                      در v2rayNG یا PattNG گزینه‌ی <b className="text-zinc-200">اسکن QR</b> را در صفحه‌ی Subscription بزنید تا ساب
                      مستقیم اضافه شود.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 border-t hairline pt-4 text-[11px] leading-6 text-zinc-500">
                * ساب توسط GitHub Action هر ۵ ساعت بازتولید و به این سرویس پوش می‌شود. فقط کانفیگ‌های ۲۴ ساعت اخیر کانال‌ها
                وارد چرخه‌ی ۴۸ ساعته می‌شوند.
              </p>
            </div>
          </Tilt>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-2">
          <Tilt intensity={3.4}>
            <div className="glass card h-full rounded-3xl border hairline p-5 sm:p-6 md:p-8">
              <p className="text-sm font-bold text-zinc-200">کلاینت‌های پیشنهادی</p>
              <ul className="mt-5 space-y-2.5 sm:space-y-3">
                {CLIENTS.map((c, idx) => (
                  <li
                    key={`${c.name}-${idx}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border hairline bg-black/20 px-4 py-2.5"
                  >
                    <span className="font-mono text-sm text-zinc-100" dir="ltr">
                      {c.name}
                    </span>
                    <span className="text-[11px] text-zinc-500">{c.platform}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Tilt>
        </Reveal>
      </div>
    </section>
  );
}
