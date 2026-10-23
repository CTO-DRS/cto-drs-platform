import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: { default: "CTO-DRS | التطبيقات والمشاريع", template: "%s | CTO-DRS" },
  description: "البوابة الرسمية لتطبيقات ومشاريع CTO-DRS.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cto-drs.com"),
  applicationName: "CTO-DRS",
  openGraph: { title: "CTO-DRS", description: "التطبيقات والمشاريع في مكان واحد", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body><SiteHeader />{children}<footer className="footer"><div className="container footer-inner"><strong>CTO-DRS</strong><span>بوابة التطبيقات والمشاريع التقنية</span><a href="mailto:cto.drs@gmail.com">الدعم والتواصل</a><span>© {new Date().getFullYear()} CTO-DRS</span></div></footer></body></html>;
}
