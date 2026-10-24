/* مكتبة المدونة: أنواع + مساعدات القراءة من content/blog.json (مصدر الحقيقة الوحيد) */

import rawPosts from "../content/blog.json";

export type BlogSection = { heading: string; paragraphs: string[] };
export type BlogPost = {
  slug: string;
  title: { ar: string };
  excerpt: { ar: string };
  date: string; // ISO
  readingMinutes: number;
  tags: string[];
  sections: BlogSection[];
};

export const posts = (rawPosts as BlogPost[])
  .slice()
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return posts.find(p => p.slug === slug);
}

export function latestPosts(limit = 3): BlogPost[] {
  return posts.slice(0, limit);
}

/** تاريخ عربي مقروء من ISO */
export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ar", { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** كل الوسوم المستخدمة دون تكرار */
export function allTags(): string[] {
  return Array.from(new Set(posts.flatMap(p => p.tags)));
}
