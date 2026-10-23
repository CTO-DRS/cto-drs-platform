import type { Metadata } from "next";
import Link from "next/link";
import { UserRound, Github, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { site } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "الحساب",
  description: "بوابة حسابات منصة DRS — متابعة تطبيقاتك ومزامنتك قيد الإعداد.",
};

export default function AccountPage() {
  const { cto } = site;
  return (
    <main className="container page narrow">
      <div className="page-intro">
        <div className="eyebrow">مساحتك الخاصة</div>
        <h1>حسابي</h1>
        <p>بوابة موحدة لمتابعة تطبيقاتك ومزامنة إعداداتك عبر أجهزتك.</p>
      </div>
      <section className="panel account-card">
        <span className="account-avatar"><UserRound size={30} aria-hidden /></span>
        <h2>بوابة الحسابات قيد الإعداد</h2>
        <p>نجهّز حاليًا نظام حسابات آمنًا يتيح متابعة تطبيقاتك المفضلة وسجل تحديثاتها. لا تشارك بياناتك مع أي جهة باسم المنصة قبل إعلان الإطلاق رسميًا من هذه الصفحة.</p>
        <ul className="account-points">
          <li><ShieldCheck size={15} aria-hidden /> ستُبنى بوابة الحسابات على معايير خصوصية صارمة.</li>
          <li><Sparkles size={15} aria-hidden /> مزامنة المفضلة والإشعارات عند توفر الإصدارات.</li>
        </ul>
        <div className="blog-links">
          <a className="btn-grad sm" href="https://github.com/CTO-DRS" target="_blank" rel="noreferrer">
            <Github size={15} aria-hidden /> تابع التطوير على GitHub
          </a>
          <Link className="btn-dark sm" href="/support">
            <Mail size={15} aria-hidden /> تواصل مع الدعم
          </Link>
        </div>
        <p className="account-cta-note">للاستفسار المباشر: <a href={`mailto:${cto.email}`}>{cto.email}</a></p>
      </section>
    </main>
  );
}
