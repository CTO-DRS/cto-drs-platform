import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, BookOpen, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "المدونة",
  description: "مقالات وأدلة وأخبار الإصدارات من منصة DRS للتطبيقات.",
};

export default function BlogPage() {
  return (
    <main className="container page narrow">
      <div className="page-intro">
        <div className="eyebrow">المعرفة والأخبار</div>
        <h1>المدونة</h1>
        <p>أدلة الاستخدام، أخبار الإصدارات، ولمحات خلف كواليس تطوير التطبيقات.</p>
      </div>
      <section className="panel blog-empty">
        <span className="blog-icon"><Newspaper size={30} aria-hidden /></span>
        <h2>لا مقالات منشورة بعد</h2>
        <p>نعمل على إعداد أولى المقالات التي تغطي استخدام التطبيقات وتفاصيل التطوير. حتى ذلك الحين، يمكنك استعراض الكتالوج ومتابعة حالة كل مشروع من صفحته.</p>
        <div className="blog-links">
          <Link className="btn-grad sm" href="/apps">تصفح التطبيقات <ArrowLeft size={15} aria-hidden /></Link>
          <Link className="btn-dark sm" href="/docs">
            <BookOpen size={15} aria-hidden /> مركز التوثيق
          </Link>
        </div>
      </section>
    </main>
  );
}
