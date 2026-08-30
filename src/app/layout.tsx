import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { JetBrains_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-vazir",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Axiom TG — ساب خودکار V2Ray از کانال‌های تلگرام",
    template: "%s · Axiom TG",
  },
  description:
    "اشتراک V2Ray خودکار: هر ۵ ساعت کانفیگ‌های تازه‌ی ۸ کانال تلگرامی استخراج، به «Axiom TG» تغییر نام و در یک ساب واحد منتشر می‌شوند. پالایش خودکار ۴۸ ساعته + آمار مصرف زنده.",
  keywords: ["v2ray", "subscription", "telegram", "vless", "vmess", "trojan", "github actions", "Axiom TG"],
  openGraph: {
    title: "Axiom TG — ساب خودکار V2Ray",
    description: "هر ۵ ساعت تازه می‌شود · کانفیگ‌های ۲۴ ساعت اخیر ۸ کانال · حذف خودکار پس از ۴۸ ساعت",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#04050a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} ${jbMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
