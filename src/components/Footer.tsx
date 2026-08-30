import { Heart, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t hairline bg-black/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-center md:flex-row md:px-6 md:text-right">
        <div>
          <p className="text-sm font-black text-zinc-100">
            <span dir="ltr" className="font-mono">Axiom TG</span> — ساب خودکار V2Ray
          </p>
          <p className="mt-1 text-[11px] leading-5 text-zinc-500">
            هر ۵ ساعت تازه می‌شود · منبع: ۸ کانال عمومی تلگرام · حذف خودکار پس از ۴۸ ساعت
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-mint" />
            آی‌پی ذخیره نمی‌شود (فقط هش نمک‌دار)
          </span>
          <span className="inline-flex items-center gap-1.5">
            ساخته‌شده با
            <Heart size={13} className="text-rose-400" />
            و GitHub Actions
          </span>
        </div>
      </div>
    </footer>
  );
}
