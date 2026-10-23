import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-app",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "CTO-DRS | التطبيقات والمشاريع", template: "%s | CTO-DRS" },
  description: "البوابة الرسمية لتطبيقات ومشاريع CTO-DRS — كتالوج موثق مع بحث وتصنيف وتفاصيل كل مشروع.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cto-drs.com"),
  applicationName: "CTO-DRS",
  keywords: ["CTO-DRS", "تطبيقات", "مشاريع", "كتالوج", "برمجة"],
  openGraph: {
    title: "CTO-DRS",
    description: "التطبيقات والمشاريع في مكان واحد",
    type: "website",
    siteName: "CTO-DRS",
  },
};

export const viewport: Viewport = {
  themeColor: "#050a14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={plexArabic.variable}>
        <a href="#main-content" className="skip-link">تخطي إلى المحتوى الرئيسي</a>
        <SiteHeader />
        <div id="main-content">{children}</div>
        <footer className="footer">
          <div className="container footer-inner">
            <strong>CTO-DRS</strong>
            <span>بوابة التطبيقات والمشاريع التقنية</span>
            <a href="mailto:cto.drs@gmail.com">الدعم والتواصل</a>
            <span>© {new Date().getFullYear()} CTO-DRS</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
