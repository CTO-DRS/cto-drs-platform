import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { posts, getPost, formatDate } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "المقال" };
  return {
    title: post.title.ar,
    description: post.excerpt.ar,
    openGraph: {
      title: post.title.ar,
      description: post.excerpt.ar,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const others = posts.filter(p => p.slug !== post.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title.ar,
    description: post.excerpt.ar,
    datePublished: post.date,
    inLanguage: "ar",
    author: { "@type": "Organization", name: "CTO-DRS" },
    keywords: post.tags.join(", "),
  };

  return (
    <main className="container page narrow">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="breadcrumbs"><Link href="/">الرئيسية</Link> / <Link href="/blog">المدونة</Link> / <span aria-current="page">{post.title.ar}</span></div>

      <article className="panel article-body">
        <header className="article-head">
          <div className="post-meta">
            <span><Clock size={13} aria-hidden /> {formatDate(post.date)}</span>
            <span>{post.readingMinutes} دقائق قراءة</span>
          </div>
          <h1>{post.title.ar}</h1>
          <p className="article-lead">{post.excerpt.ar}</p>
          <div className="post-tags">
            <Tag size={13} aria-hidden className="post-tag-icon" />
            {post.tags.map(tag => <span className="cat-tag" key={tag}>{tag}</span>)}
          </div>
        </header>

        {post.sections.map((section, i) => (
          <section key={i}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph, j) => <p key={j}>{paragraph}</p>)}
          </section>
        ))}

        <footer className="article-foot">
          <Link className="text-link" href="/blog">
            <ArrowLeft size={15} aria-hidden /> جميع المقالات
          </Link>
        </footer>
      </article>

      {others.length > 0 && (
        <section className="related-section">
          <div className="section-heading"><div><div className="eyebrow">من المدونة</div><h2>مقالات ذات صلة</h2></div></div>
          <div className="app-grid">
            {others.map(other => (
              <article className="app-card compact" key={other.slug}>
                <div className="app-card-body">
                  <div className="app-title-row"><h3><Link href={`/blog/${other.slug}`}>{other.title.ar}</Link></h3></div>
                  <p>{other.excerpt.ar}</p>
                  <div className="app-card-bottom"><span className="cat-tag">{formatDate(other.date)}</span><Link href={`/blog/${other.slug}`}>اقرأ ←</Link></div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
