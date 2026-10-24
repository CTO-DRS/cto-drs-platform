import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, BookOpen, ArrowLeft, Clock } from "lucide-react";
import { posts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "المدونة",
  description: "مقالات وأدلة وأخبار الإصدارات من منصة DRS للتطبيقات — كواليس التطوير، فلسفة الكتالوج، والإعلانات.",
};

export default function BlogPage() {
  return (
    <main className="container page narrow">
      <div className="page-intro">
        <div className="eyebrow">المعرفة والأخبار</div>
        <h1>المدونة</h1>
        <p>أدلة الاستخدام، أخبار الإصدارات، ولمحات خلف كواليس تطوير التطبيقات.</p>
      </div>

      {posts.length ? (
        <div className="post-list">
          {posts.map(post => (
            <article className="post-card" key={post.slug}>
              <div className="post-meta">
                <span><Clock size={13} aria-hidden /> {formatDate(post.date)}</span>
                <span>{post.readingMinutes} دقائق قراءة</span>
              </div>
              <h2><Link href={`/blog/${post.slug}`}>{post.title.ar}</Link></h2>
              <p>{post.excerpt.ar}</p>
              <div className="post-card-bottom">
                <div className="post-tags">
                  {post.tags.map(tag => <span className="cat-tag" key={tag}>{tag}</span>)}
                </div>
                <Link className="text-link" href={`/blog/${post.slug}`}>
                  اقرأ المقال <ArrowLeft size={15} aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="panel blog-empty">
          <span className="blog-icon"><Newspaper size={30} aria-hidden /></span>
          <h2>لا مقالات منشورة بعد</h2>
          <p>نعمل على إعداد أولى المقالات. يمكنك استعراض الكتالوج ومتابعة حالة كل مشروع من صفحته.</p>
        </section>
      )}

      <div className="blog-links top-margin">
        <Link className="btn-grad sm" href="/apps">تصفح التطبيقات <ArrowLeft size={15} aria-hidden /></Link>
        <Link className="btn-dark sm" href="/docs">
          <BookOpen size={15} aria-hidden /> مركز التوثيق
        </Link>
      </div>
    </main>
  );
}
