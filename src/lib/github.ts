/* تكامل GitHub: تحليل روابط المستودعات وجلب إحصاءات حية (بيانات حقيقية فقط، بدون أي اختلاق) */

export type RepoRef = { owner: string; repo: string; url: string };

export type RepoStats = {
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  pushedAt: string | null;
  description: string | null;
  topics: string[];
  license: string | null;
  defaultBranch: string;
};

/** استخراج (owner/repo) من رابط مستودع GitHub صالح عبر HTTPS فقط */
export function parseGithubRepo(url: string | null | undefined): RepoRef | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com" && parsed.hostname !== "www.github.com") return null;
    if (parsed.protocol !== "https:") return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, "");
    if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) return null;
    return { owner, repo, url: `https://github.com/${owner}/${repo}` };
  } catch {
    return null;
  }
}

/** جلب إحصاءات مستودع عام من GitHub API مع تخزين مؤقت لمدة ساعة (ISR).
 *  يستخدم GITHUB_TOKEN اختيارياً من متغيرات بيئة الخادم (يرفع الحد إلى 5000/ساعة)،
 *  وإلا يعتمد على الطلبات العامة، ويرجع null عند أي فشل دون تعطيل الصفحة. */
export async function fetchRepoStats(ref: RepoRef): Promise<RepoStats | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "cto-drs-platform",
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`https://api.github.com/repos/${ref.owner}/${ref.repo}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    return {
      stars: typeof data.stargazers_count === "number" ? data.stargazers_count : 0,
      forks: typeof data.forks_count === "number" ? data.forks_count : 0,
      openIssues: typeof data.open_issues_count === "number" ? data.open_issues_count : 0,
      language: typeof data.language === "string" ? data.language : null,
      pushedAt: typeof data.pushed_at === "string" ? data.pushed_at : null,
      description: typeof data.description === "string" ? data.description : null,
      topics: Array.isArray(data.topics) ? (data.topics as string[]).slice(0, 6) : [],
      license: data.license && typeof data.license === "object" && typeof (data.license as Record<string, unknown>).spdx_id === "string"
        ? ((data.license as Record<string, unknown>).spdx_id as string)
        : null,
      defaultBranch: typeof data.default_branch === "string" ? data.default_branch : "main",
    };
  } catch {
    return null;
  }
}

/** تنسيق الأرقام العربية المختصرة (1.2K، 3.4K ...) */
export function compactNumber(value: number): string {
  if (value >= 1000) {
    const n = (value / 1000).toFixed(1).replace(/\.0$/, "");
    return `${n}K`;
  }
  return String(value);
}

/** تاريخ عربي مقروء من ISO */
export function formatDateAr(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("ar", { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso));
  } catch {
    return "—";
  }
}

/** عدد التطبيقات المربوطة بمستودعات حقيقية في الكتالوج */
export function openSourceCount(list: { repository: string | null }[]): number {
  return list.filter(a => parseGithubRepo(a.repository)).length;
}
