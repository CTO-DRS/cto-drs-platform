import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Cairo } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CommandPalette } from "@/components/command-palette";
import { GlobalChrome } from "@/components/global-chrome";
import { PwaLayer } from "@/components/pwa-layer";
import { AnnouncementBar } from "@/components/announcement-bar";
import { MobileTabBar } from "@/components/mobile-tabbar";
import { activeAnnouncements } from "@/lib/catalog";

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-app",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-head",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "DRS | منصة التطبيقات", template: "%s | DRS" },
  description: "منصة DRS الرسمية للتطبيقات والمشاريع — جميع التطبيقات في مكان واحد مع تفاصيل وتحميلات موثقة.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cto-drs.com"),
  applicationName: "DRS Apps & More",
  keywords: ["DRS", "تطبيقات", "أندرويد", "متجر تطبيقات", "CTO-DRS"],
  icons: {
    icon: [
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/icon-192.png"],
  },
  openGraph: {
    title: "DRS | منصة التطبيقات",
    description: "جميع التطبيقات في مكان واحد",
    type: "website",
    siteName: "DRS Apps & More",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  /* يُنفّذ قبل أول رسم: يستعيد المظهر (داكن/فاتح/تلقائي حسب النظام) ولون التمييز بلا وميض */
  const themeBoot = `(function(){try{var t=localStorage.getItem("drs-theme");var a=localStorage.getItem("drs-accent");var d=document.documentElement;var sysLight=window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches;if(t==="light"||(t==="auto"&&sysLight))d.dataset.theme="light";if(a&&/^(violet|cyan|emerald|amber)$/.test(a))d.dataset.accent=a;}catch(e){}})();`;
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${plexArabic.variable} ${cairo.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <a href="#main-content" className="skip-link">تخطي إلى المحتوى الرئيسي</a>
        <SiteHeader />
        <AnnouncementBar items={activeAnnouncements()} />
        <div id="main-content">{children}</div>
        <SiteFooter />
        <CommandPalette />
        <MobileTabBar />
        <GlobalChrome />
        <PwaLayer />
      </body>
    </html>
  );
}
