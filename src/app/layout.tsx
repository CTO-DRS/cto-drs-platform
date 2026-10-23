import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Cairo } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
  return (
    <html lang="ar" dir="rtl">
      <body className={`${plexArabic.variable} ${cairo.variable}`}>
        <a href="#main-content" className="skip-link">تخطي إلى المحتوى الرئيسي</a>
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
