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

/** تاريخ مقروء بحسب اللغة (ar/en) من ISO — تُستخدم في النسخ الإنجليزية */
export function formatDateLocalized(iso: string | null, lang: "ar" | "en" = "ar"): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(lang, { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso));
  } catch {
    return "—";
  }
}

/** عدد التطبيقات المربوطة بمستودعات حقيقية في الكتالوج */
export function openSourceCount(list: { repository: string | null }[]): number {
  return list.filter(a => parseGithubRepo(a.repository)).length;
}

/* ===== شارات حية لبطاقات الكتالوق ===== */

export type CardLive = {
  stars: number;
  pushedAt: string | null;
  /** إجمالي تنزيلات أصول الإصدارات المنشورة (من GitHub Releases) — 0 إن لا إصدارات */
  downloads: number;
  /** وسم أحدث إصدار منشور */
  latestTag: string | null;
  /** تاريخ نشر أحدث إصدار — يُستخدم لشارة «جديد» */
  releasedAt: string | null;
};
export type CatalogStatsMap = Record<string, CardLive>;

/** ملخص إصدارات مستودع: إجمالي التنزيلات + أحدث وسم + تاريخه.
 *  يعيد قيمًا صفرية عند أي فشل دون كسر الصفحة. */
export async function fetchRepoReleaseSummary(ref: RepoRef): Promise<{
  downloads: number;
  latestTag: string | null;
  releasedAt: string | null;
}> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "cto-drs-platform",
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(
      `https://api.github.com/repos/${ref.owner}/${ref.repo}/releases?per_page=100`,
      { headers, next: { revalidate: 3600 } },
    );
    if (!res.ok) return { downloads: 0, latestTag: null, releasedAt: null };
    const data = (await res.json()) as Record<string, unknown>[];
    if (!Array.isArray(data)) return { downloads: 0, latestTag: null, releasedAt: null };
    let downloads = 0;
    for (const rel of data) {
      const assets = Array.isArray(rel.assets) ? rel.assets : [];
      for (const asset of assets) {
        const count = (asset as Record<string, unknown>).download_count;
        if (typeof count === "number") downloads += count;
      }
    }
    const latest = data.find(
      rel => typeof rel.tag_name === "string" && rel.draft !== true,
    );
    return {
      downloads,
      latestTag: latest && typeof latest.tag_name === "string" ? latest.tag_name : null,
      releasedAt: latest && typeof latest.published_at === "string" ? latest.published_at : null,
    };
  } catch {
    return { downloads: 0, latestTag: null, releasedAt: null };
  }
}

/** هل وُلّد الإصدار خلال المدى القريب؟ (شارة «جديد» — 21 يومًا) */
export function isFreshRelease(iso: string | null | undefined, days = 21): boolean {
  if (!iso) return false;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  return Date.now() - t < days * 24 * 60 * 60 * 1000;
}

/** إحصاءات مصغرة لكل تطبيق مربوط بمستودع — تجلب بالتوازي مع تخزين ساعة.
 *  التطبيق الفاشل (تقييد API مثلًا) يُحذف من الخريطة بصمت فتختفي شارته دون كسر الصفحة. */
export async function fetchCatalogRepoStats(
  list: { slug: string; repository: string | null }[]
): Promise<CatalogStatsMap> {
  const items = list
    .map(a => ({ slug: a.slug, ref: parseGithubRepo(a.repository) }))
    .filter((x): x is { slug: string; ref: RepoRef } => x.ref !== null);
  if (!items.length) return {};

  const settled = await Promise.allSettled(
    items.map(async ({ slug, ref }) => {
      const [stats, release] = await Promise.all([
        fetchRepoStats(ref),
        fetchRepoReleaseSummary(ref),
      ]);
      if (!stats && !release.latestTag) return null;
      return [
        slug,
        {
          stars: stats?.stars ?? 0,
          pushedAt: stats?.pushedAt ?? null,
          downloads: release.downloads,
          latestTag: release.latestTag,
          releasedAt: release.releasedAt,
        },
      ] as const;
    })
  );

  const map: CatalogStatsMap = {};
  for (const result of settled) {
    if (result.status === "fulfilled" && result.value) map[result.value[0]] = result.value[1];
  }
  return map;
}

/* ===== أحدث الإصدارات المنشورة ===== */

export type ReleaseInfo = {
  repo: string;
  url: string;
  tag: string;
  name: string | null;
  publishedAt: string | null;
  notes: string | null;
  prerelease: boolean;
};

/** تنظيف ملاحظات الإصدار من صيغ Markdown والوسوم لإظهار نص عربي/لاتيني نظيف */
function sanitizeReleaseNotes(body: string | null | undefined): string | null {
  if (!body) return null;
  const cleaned = body
    .replace(/<img[^>]*>/gi, "")              // وسوم الصور
    .replace(/<[^>]+>/g, "")                  // أي وسوم HTML أخرى
    .replace(/```[\s\S]*?```/g, "")           // كتل الأكواد
    .replace(/`([^`]*)`/g, "$1")              // الأكواد السطرية
    .replace(/^#{1,6}\s*/gm, "")              // عناوين Markdown
    .replace(/\*\*([^*]+)\*\*/g, "$1")        // الغامق
    .replace(/\*([^*]+)\*/g, "$1")            // المائل
    .replace(/^[-*+]\s+/gm, "• ")             // نقاط القوائم
    .replace(/\r/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim()
    .slice(0, 200);
  return cleaned || null;
}

/** جلب آخر إصدار منشور لكل مستودع من مستودعات الكتالوج (بالتوازي، تخزين ساعة).
 *  المستودعات بلا إصدارات تُتخطى بصمت — لا بيانات مختلقة. */
export async function fetchLatestReleases(
  refs: { owner: string; repo: string; url: string }[],
  limit = 6
): Promise<ReleaseInfo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "cto-drs-platform",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const results = await Promise.allSettled(
    refs.map(async ref => {
      const res = await fetch(
        `https://api.github.com/repos/${ref.owner}/${ref.repo}/releases/latest`,
        { headers, next: { revalidate: 3600 } }
      );
      if (!res.ok) return null; // 404 = لا توجد إصدارات منشورة
      const data = (await res.json()) as Record<string, unknown>;
      if (typeof data.tag_name !== "string") return null;
      return {
        repo: ref.repo,
        url: `${ref.url}/releases/latest`,
        tag: data.tag_name,
        name: typeof data.name === "string" && data.name ? data.name : null,
        publishedAt: typeof data.published_at === "string" ? data.published_at : null,
        notes: sanitizeReleaseNotes(typeof data.body === "string" ? data.body : null),
        prerelease: data.prerelease === true,
      } satisfies ReleaseInfo;
    })
  );

  return results
    .map(r => (r.status === "fulfilled" ? r.value : null))
    .filter((r): r is ReleaseInfo => r !== null)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, limit);
}

/** تغذية إصدارات مجمعة: آخر N إصدارات لكل مستودع من مستودعات الكتالوج تُدمج وتُرتب زمنيًا.
 *  كل عنصر يحمل مرجع المستودع لربطه بتطبيق الكتالوق. الفشل الفرعي يُتخطى بصمت. */
export async function fetchRecentReleasesFeed(
  refs: { owner: string; repo: string; url: string }[],
  perRepo = 3,
  limit = 12
): Promise<ReleaseInfo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "cto-drs-platform",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const results = await Promise.allSettled(
    refs.map(async ref => {
      const res = await fetch(
        `https://api.github.com/repos/${ref.owner}/${ref.repo}/releases?per_page=${perRepo}`,
        { headers, next: { revalidate: 3600 } }
      );
      if (!res.ok) return [];
      const data = (await res.json()) as Record<string, unknown>[];
      if (!Array.isArray(data)) return [];
      return data
        .filter(rel => typeof rel.tag_name === "string" && rel.draft !== true)
        .map(rel => ({
          repo: ref.repo,
          url: typeof rel.html_url === "string" ? rel.html_url : `${ref.url}/releases`,
          tag: rel.tag_name as string,
          name: typeof rel.name === "string" && rel.name ? rel.name : null,
          publishedAt: typeof rel.published_at === "string" ? rel.published_at : null,
          notes: sanitizeReleaseNotes(typeof rel.body === "string" ? rel.body : null),
          prerelease: rel.prerelease === true,
        } satisfies ReleaseInfo));
    })
  );

  return results
    .flatMap(r => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, limit);
}

/** مقارنة إصدارات دلالية مبسطة: تتجاهل البادئة v وتقارن المقاطع الرقمية.
 *  تعيد 1 إذا a أحدث، -1 إذا b أحدث، 0 إذا متكافئان، وnull إذا تعذر التحليل. */
export function compareVersions(a: string, b: string): number | null {
  const clean = (v: string) =>
    v.trim().replace(/^v/i, "").split(/[-+]/)[0]; // تجاهل v واللاحقات مثل -beta
  const parse = (v: string): number[] | null => {
    const parts = clean(v).split(".").map(p => Number.parseInt(p, 10));
    if (!parts.length || parts.some(p => !Number.isFinite(p))) return null;
    return parts;
  };
  const pa = parse(a);
  const pb = parse(b);
  if (!pa || !pb) return null;
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

/* ===== مستودعات الحساب (على مستوى المالك) ===== */

export type OrgRepo = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string | null;
  homepage: string | null;
  isArchived: boolean;
};

/** جلب المستودعات العامة لحساب GitHub مرتبة بالتطوير الأحدث، مع تخزين مؤقت لمدة ساعة.
 *  نفس سياسة الأمان: GITHUB_TOKEN اختياري، وأي فشل يعيد [] دون تعطيل الصفحة. */
export async function fetchOrgRepos(owner: string, limit = 12): Promise<OrgRepo[]> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "cto-drs-platform",
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(owner)}/repos?sort=pushed&per_page=100&type=owner`,
      { headers, next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as Record<string, unknown>[];
    if (!Array.isArray(data)) return [];
    return data
      .filter(r => r.archived !== true)
      .slice(0, limit)
      .map(r => ({
        name: typeof r.name === "string" ? r.name : "",
        url: typeof r.html_url === "string" ? r.html_url : `https://github.com/${owner}`,
        description: typeof r.description === "string" ? r.description : null,
        language: typeof r.language === "string" ? r.language : null,
        stars: typeof r.stargazers_count === "number" ? r.stargazers_count : 0,
        forks: typeof r.forks_count === "number" ? r.forks_count : 0,
        pushedAt: typeof r.pushed_at === "string" ? r.pushed_at : null,
        homepage: typeof r.homepage === "string" && r.homepage ? r.homepage : null,
        isArchived: r.archived === true,
      }))
      .filter(r => r.name);
  } catch {
    return [];
  }
}
