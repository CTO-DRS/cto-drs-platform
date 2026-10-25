module.exports = [
"[project]/src/app/icon.svg.mjs { IMAGE => \"[project]/src/app/icon.svg (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/icon.svg.mjs { IMAGE => \"[project]/src/app/icon.svg (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/src/app/opengraph-image--metadata.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/opengraph-image--metadata.js [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/error.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/error.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/not-found.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/not-found.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/github.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* تكامل GitHub: تحليل روابط المستودعات وجلب إحصاءات حية (بيانات حقيقية فقط، بدون أي اختلاق) */ __turbopack_context__.s([
    "compactNumber",
    ()=>compactNumber,
    "compareVersions",
    ()=>compareVersions,
    "fetchCatalogRepoStats",
    ()=>fetchCatalogRepoStats,
    "fetchLatestReleases",
    ()=>fetchLatestReleases,
    "fetchOrgRepos",
    ()=>fetchOrgRepos,
    "fetchRecentReleasesFeed",
    ()=>fetchRecentReleasesFeed,
    "fetchRepoReleaseSummary",
    ()=>fetchRepoReleaseSummary,
    "fetchRepoStats",
    ()=>fetchRepoStats,
    "formatDateAr",
    ()=>formatDateAr,
    "isFreshRelease",
    ()=>isFreshRelease,
    "openSourceCount",
    ()=>openSourceCount,
    "parseGithubRepo",
    ()=>parseGithubRepo
]);
function parseGithubRepo(url) {
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
        return {
            owner,
            repo,
            url: `https://github.com/${owner}/${repo}`
        };
    } catch  {
        return null;
    }
}
async function fetchRepoStats(ref) {
    try {
        const headers = {
            Accept: "application/vnd.github+json",
            "User-Agent": "cto-drs-platform"
        };
        const token = process.env.GITHUB_TOKEN;
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`https://api.github.com/repos/${ref.owner}/${ref.repo}`, {
            headers,
            next: {
                revalidate: 3600
            }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return {
            stars: typeof data.stargazers_count === "number" ? data.stargazers_count : 0,
            forks: typeof data.forks_count === "number" ? data.forks_count : 0,
            openIssues: typeof data.open_issues_count === "number" ? data.open_issues_count : 0,
            language: typeof data.language === "string" ? data.language : null,
            pushedAt: typeof data.pushed_at === "string" ? data.pushed_at : null,
            description: typeof data.description === "string" ? data.description : null,
            topics: Array.isArray(data.topics) ? data.topics.slice(0, 6) : [],
            license: data.license && typeof data.license === "object" && typeof data.license.spdx_id === "string" ? data.license.spdx_id : null,
            defaultBranch: typeof data.default_branch === "string" ? data.default_branch : "main"
        };
    } catch  {
        return null;
    }
}
function compactNumber(value) {
    if (value >= 1000) {
        const n = (value / 1000).toFixed(1).replace(/\.0$/, "");
        return `${n}K`;
    }
    return String(value);
}
function formatDateAr(iso) {
    if (!iso) return "—";
    try {
        return new Intl.DateTimeFormat("ar", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }).format(new Date(iso));
    } catch  {
        return "—";
    }
}
function openSourceCount(list) {
    return list.filter((a)=>parseGithubRepo(a.repository)).length;
}
async function fetchRepoReleaseSummary(ref) {
    try {
        const headers = {
            Accept: "application/vnd.github+json",
            "User-Agent": "cto-drs-platform"
        };
        const token = process.env.GITHUB_TOKEN;
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`https://api.github.com/repos/${ref.owner}/${ref.repo}/releases?per_page=100`, {
            headers,
            next: {
                revalidate: 3600
            }
        });
        if (!res.ok) return {
            downloads: 0,
            latestTag: null,
            releasedAt: null
        };
        const data = await res.json();
        if (!Array.isArray(data)) return {
            downloads: 0,
            latestTag: null,
            releasedAt: null
        };
        let downloads = 0;
        for (const rel of data){
            const assets = Array.isArray(rel.assets) ? rel.assets : [];
            for (const asset of assets){
                const count = asset.download_count;
                if (typeof count === "number") downloads += count;
            }
        }
        const latest = data.find((rel)=>typeof rel.tag_name === "string" && rel.draft !== true);
        return {
            downloads,
            latestTag: latest && typeof latest.tag_name === "string" ? latest.tag_name : null,
            releasedAt: latest && typeof latest.published_at === "string" ? latest.published_at : null
        };
    } catch  {
        return {
            downloads: 0,
            latestTag: null,
            releasedAt: null
        };
    }
}
function isFreshRelease(iso, days = 21) {
    if (!iso) return false;
    const t = Date.parse(iso);
    if (Number.isNaN(t)) return false;
    return Date.now() - t < days * 24 * 60 * 60 * 1000;
}
async function fetchCatalogRepoStats(list) {
    const items = list.map((a)=>({
            slug: a.slug,
            ref: parseGithubRepo(a.repository)
        })).filter((x)=>x.ref !== null);
    if (!items.length) return {};
    const settled = await Promise.allSettled(items.map(async ({ slug, ref })=>{
        const [stats, release] = await Promise.all([
            fetchRepoStats(ref),
            fetchRepoReleaseSummary(ref)
        ]);
        if (!stats && !release.latestTag) return null;
        return [
            slug,
            {
                stars: stats?.stars ?? 0,
                pushedAt: stats?.pushedAt ?? null,
                downloads: release.downloads,
                latestTag: release.latestTag,
                releasedAt: release.releasedAt
            }
        ];
    }));
    const map = {};
    for (const result of settled){
        if (result.status === "fulfilled" && result.value) map[result.value[0]] = result.value[1];
    }
    return map;
}
/** تنظيف ملاحظات الإصدار من صيغ Markdown والوسوم لإظهار نص عربي/لاتيني نظيف */ function sanitizeReleaseNotes(body) {
    if (!body) return null;
    const cleaned = body.replace(/<img[^>]*>/gi, "") // وسوم الصور
    .replace(/<[^>]+>/g, "") // أي وسوم HTML أخرى
    .replace(/```[\s\S]*?```/g, "") // كتل الأكواد
    .replace(/`([^`]*)`/g, "$1") // الأكواد السطرية
    .replace(/^#{1,6}\s*/gm, "") // عناوين Markdown
    .replace(/\*\*([^*]+)\*\*/g, "$1") // الغامق
    .replace(/\*([^*]+)\*/g, "$1") // المائل
    .replace(/^[-*+]\s+/gm, "• ") // نقاط القوائم
    .replace(/\r/g, "").replace(/\n{2,}/g, "\n").trim().slice(0, 200);
    return cleaned || null;
}
async function fetchLatestReleases(refs, limit = 6) {
    const headers = {
        Accept: "application/vnd.github+json",
        "User-Agent": "cto-drs-platform"
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const results = await Promise.allSettled(refs.map(async (ref)=>{
        const res = await fetch(`https://api.github.com/repos/${ref.owner}/${ref.repo}/releases/latest`, {
            headers,
            next: {
                revalidate: 3600
            }
        });
        if (!res.ok) return null; // 404 = لا توجد إصدارات منشورة
        const data = await res.json();
        if (typeof data.tag_name !== "string") return null;
        return {
            repo: ref.repo,
            url: `${ref.url}/releases/latest`,
            tag: data.tag_name,
            name: typeof data.name === "string" && data.name ? data.name : null,
            publishedAt: typeof data.published_at === "string" ? data.published_at : null,
            notes: sanitizeReleaseNotes(typeof data.body === "string" ? data.body : null),
            prerelease: data.prerelease === true
        };
    }));
    return results.map((r)=>r.status === "fulfilled" ? r.value : null).filter((r)=>r !== null).sort((a, b)=>(b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")).slice(0, limit);
}
async function fetchRecentReleasesFeed(refs, perRepo = 3, limit = 12) {
    const headers = {
        Accept: "application/vnd.github+json",
        "User-Agent": "cto-drs-platform"
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const results = await Promise.allSettled(refs.map(async (ref)=>{
        const res = await fetch(`https://api.github.com/repos/${ref.owner}/${ref.repo}/releases?per_page=${perRepo}`, {
            headers,
            next: {
                revalidate: 3600
            }
        });
        if (!res.ok) return [];
        const data = await res.json();
        if (!Array.isArray(data)) return [];
        return data.filter((rel)=>typeof rel.tag_name === "string" && rel.draft !== true).map((rel)=>({
                repo: ref.repo,
                url: typeof rel.html_url === "string" ? rel.html_url : `${ref.url}/releases`,
                tag: rel.tag_name,
                name: typeof rel.name === "string" && rel.name ? rel.name : null,
                publishedAt: typeof rel.published_at === "string" ? rel.published_at : null,
                notes: sanitizeReleaseNotes(typeof rel.body === "string" ? rel.body : null),
                prerelease: rel.prerelease === true
            }));
    }));
    return results.flatMap((r)=>r.status === "fulfilled" ? r.value : []).sort((a, b)=>(b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")).slice(0, limit);
}
function compareVersions(a, b) {
    const clean = (v)=>v.trim().replace(/^v/i, "").split(/[-+]/)[0]; // تجاهل v واللاحقات مثل -beta
    const parse = (v)=>{
        const parts = clean(v).split(".").map((p)=>Number.parseInt(p, 10));
        if (!parts.length || parts.some((p)=>!Number.isFinite(p))) return null;
        return parts;
    };
    const pa = parse(a);
    const pb = parse(b);
    if (!pa || !pb) return null;
    const len = Math.max(pa.length, pb.length);
    for(let i = 0; i < len; i++){
        const x = pa[i] ?? 0;
        const y = pb[i] ?? 0;
        if (x > y) return 1;
        if (x < y) return -1;
    }
    return 0;
}
async function fetchOrgRepos(owner, limit = 12) {
    try {
        const headers = {
            Accept: "application/vnd.github+json",
            "User-Agent": "cto-drs-platform"
        };
        const token = process.env.GITHUB_TOKEN;
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(owner)}/repos?sort=pushed&per_page=100&type=owner`, {
            headers,
            next: {
                revalidate: 3600
            }
        });
        if (!res.ok) return [];
        const data = await res.json();
        if (!Array.isArray(data)) return [];
        return data.filter((r)=>r.archived !== true).slice(0, limit).map((r)=>({
                name: typeof r.name === "string" ? r.name : "",
                url: typeof r.html_url === "string" ? r.html_url : `https://github.com/${owner}`,
                description: typeof r.description === "string" ? r.description : null,
                language: typeof r.language === "string" ? r.language : null,
                stars: typeof r.stargazers_count === "number" ? r.stargazers_count : 0,
                forks: typeof r.forks_count === "number" ? r.forks_count : 0,
                pushedAt: typeof r.pushed_at === "string" ? r.pushed_at : null,
                homepage: typeof r.homepage === "string" && r.homepage ? r.homepage : null,
                isArchived: r.archived === true
            })).filter((r)=>r.name);
    } catch  {
        return [];
    }
}
}),
"[project]/src/components/favorites-section.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FavoritesSection",
    ()=>FavoritesSection
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const FavoritesSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FavoritesSection() from the server but FavoritesSection is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/favorites-section.tsx <module evaluation>", "FavoritesSection");
}),
"[project]/src/components/favorites-section.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FavoritesSection",
    ()=>FavoritesSection
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const FavoritesSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call FavoritesSection() from the server but FavoritesSection is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/favorites-section.tsx", "FavoritesSection");
}),
"[project]/src/components/favorites-section.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$favorites$2d$section$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/favorites-section.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$favorites$2d$section$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/favorites-section.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$favorites$2d$section$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/release-alerts.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReleaseAlerts",
    ()=>ReleaseAlerts
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ReleaseAlerts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ReleaseAlerts() from the server but ReleaseAlerts is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/release-alerts.tsx <module evaluation>", "ReleaseAlerts");
}),
"[project]/src/components/release-alerts.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReleaseAlerts",
    ()=>ReleaseAlerts
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ReleaseAlerts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ReleaseAlerts() from the server but ReleaseAlerts is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/release-alerts.tsx", "ReleaseAlerts");
}),
"[project]/src/components/release-alerts.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$release$2d$alerts$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/release-alerts.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$release$2d$alerts$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/release-alerts.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$release$2d$alerts$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/notify-log.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotifyLog",
    ()=>NotifyLog
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const NotifyLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call NotifyLog() from the server but NotifyLog is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/notify-log.tsx <module evaluation>", "NotifyLog");
}),
"[project]/src/components/notify-log.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotifyLog",
    ()=>NotifyLog
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const NotifyLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call NotifyLog() from the server but NotifyLog is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/notify-log.tsx", "NotifyLog");
}),
"[project]/src/components/notify-log.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$notify$2d$log$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/notify-log.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$notify$2d$log$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/notify-log.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$notify$2d$log$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/back-button.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BackButton",
    ()=>BackButton
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const BackButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call BackButton() from the server but BackButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/back-button.tsx <module evaluation>", "BackButton");
}),
"[project]/src/components/back-button.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BackButton",
    ()=>BackButton
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const BackButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call BackButton() from the server but BackButton is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/back-button.tsx", "BackButton");
}),
"[project]/src/components/back-button.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$back$2d$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/back-button.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$back$2d$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/back-button.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$back$2d$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/account/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AccountPage,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-round.js [app-rsc] (ecmascript) <export default as UserRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$github$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Github$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/github.js [app-rsc] (ecmascript) <export default as Github>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-rsc] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-rsc] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-rsc] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/github.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$favorites$2d$section$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/favorites-section.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$release$2d$alerts$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/release-alerts.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$notify$2d$log$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/notify-log.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$back$2d$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/back-button.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
const metadata = {
    title: "الحساب",
    description: "بوابة حسابات منصة DRS — مفضلتك وإشعارات الإصدارات وسجل التنبيهات، كلها محفوظة على جهازك."
};
async function AccountPage() {
    const { cto } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["site"];
    /* بيانات الإصدارات الحية لكل التطبيقات — مصدر مراقبة الإشعارات (تُحدّث كل ساعة) */ const statsMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchCatalogRepoStats"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apps"]);
    const watchApps = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apps"].map((a)=>({
            slug: a.slug,
            name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appName"])(a),
            latestTag: statsMap[a.slug]?.latestTag ?? null,
            releasedAt: statsMap[a.slug]?.releasedAt ?? null
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "container page narrow",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$back$2d$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BackButton"], {
                fallback: "/",
                label: "رجوع"
            }, void 0, false, {
                fileName: "[project]/src/app/account/page.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-intro",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "eyebrow",
                        children: "مساحتك الخاصة"
                    }, void 0, false, {
                        fileName: "[project]/src/app/account/page.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "حسابي"
                    }, void 0, false, {
                        fileName: "[project]/src/app/account/page.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "بوابة موحدة لمتابعة تطبيقاتك المفضلة وإشعارات إصداراتها — بلا تسجيل، وكل بياناتك على جهازك فقط."
                    }, void 0, false, {
                        fileName: "[project]/src/app/account/page.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/account/page.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$favorites$2d$section$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FavoritesSection"], {}, void 0, false, {
                fileName: "[project]/src/app/account/page.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$release$2d$alerts$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ReleaseAlerts"], {
                apps: watchApps
            }, void 0, false, {
                fileName: "[project]/src/app/account/page.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$notify$2d$log$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NotifyLog"], {}, void 0, false, {
                fileName: "[project]/src/app/account/page.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "panel account-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "account-avatar",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__["UserRound"], {
                            size: 30,
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/app/account/page.tsx",
                            lineNumber: 40,
                            columnNumber: 42
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/account/page.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "بوابة الحسابات قيد الإعداد"
                    }, void 0, false, {
                        fileName: "[project]/src/app/account/page.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "نجهّز حاليًا نظام حسابات آمنًا يتيح متابعة تطبيقاتك المفضلة وسجل تحديثاتها. لا تشارك بياناتك مع أي جهة باسم المنصة قبل إعلان الإطلاق رسميًا من هذه الصفحة."
                    }, void 0, false, {
                        fileName: "[project]/src/app/account/page.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "account-points",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                        size: 15,
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/account/page.tsx",
                                        lineNumber: 44,
                                        columnNumber: 15
                                    }, this),
                                    " ستُبنى بوابة الحسابات على معايير خصوصية صارمة."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/account/page.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        size: 15,
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/account/page.tsx",
                                        lineNumber: 45,
                                        columnNumber: 15
                                    }, this),
                                    " مزامنة المفضلة والإشعارات عند توفر الإصدارات."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/account/page.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/account/page.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "blog-links",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                className: "btn-grad sm",
                                href: "https://github.com/CTO-DRS",
                                target: "_blank",
                                rel: "noreferrer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$github$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Github$3e$__["Github"], {
                                        size: 15,
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/account/page.tsx",
                                        lineNumber: 49,
                                        columnNumber: 13
                                    }, this),
                                    " تابع التطوير على GitHub"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/account/page.tsx",
                                lineNumber: 48,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                className: "btn-dark sm",
                                href: "/support",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                        size: 15,
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/account/page.tsx",
                                        lineNumber: 52,
                                        columnNumber: 13
                                    }, this),
                                    " تواصل مع الدعم"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/account/page.tsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/account/page.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "account-cta-note",
                        children: [
                            "للاستفسار المباشر: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: `mailto:${cto.email}`,
                                children: cto.email
                            }, void 0, false, {
                                fileName: "[project]/src/app/account/page.tsx",
                                lineNumber: 55,
                                columnNumber: 60
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/account/page.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/account/page.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/account/page.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/account/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/account/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__45dc5152._.js.map