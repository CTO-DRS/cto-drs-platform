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
"[project]/src/components/compare-client.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CompareClient",
    ()=>CompareClient
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const CompareClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call CompareClient() from the server but CompareClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/compare-client.tsx <module evaluation>", "CompareClient");
}),
"[project]/src/components/compare-client.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CompareClient",
    ()=>CompareClient
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const CompareClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call CompareClient() from the server but CompareClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/compare-client.tsx", "CompareClient");
}),
"[project]/src/components/compare-client.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$compare$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/compare-client.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$compare$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/compare-client.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$compare$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/en-document.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EnDocument",
    ()=>EnDocument
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const EnDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call EnDocument() from the server but EnDocument is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/en-document.tsx <module evaluation>", "EnDocument");
}),
"[project]/src/components/en-document.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EnDocument",
    ()=>EnDocument
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const EnDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call EnDocument() from the server but EnDocument is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/en-document.tsx", "EnDocument");
}),
"[project]/src/components/en-document.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$en$2d$document$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/en-document.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$en$2d$document$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/en-document.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$en$2d$document$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/en/compare/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EnglishComparePage,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$compare$2d$arrows$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__GitCompareArrows$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-compare-arrows.js [app-rsc] (ecmascript) <export default as GitCompareArrows>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/languages.js [app-rsc] (ecmascript) <export default as Languages>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/github.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$compare$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/compare-client.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$en$2d$document$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/en-document.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const metadata = {
    title: "Compare apps side by side — DRS",
    description: "Pick two or three apps from the DRS catalog and compare their status, category, latest live GitHub releases, downloads and stars in one table — shareable comparison links.",
    alternates: {
        languages: {
            ar: "/compare",
            en: "/en/compare"
        }
    }
};
async function EnglishComparePage({ searchParams }) {
    const sp = await searchParams;
    const statsMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchCatalogRepoStats"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apps"]);
    const live = {};
    for (const [slug, st] of Object.entries(statsMap)){
        live[slug] = {
            latestTag: st.latestTag,
            releasedAt: st.releasedAt,
            downloads: st.downloads,
            stars: st.stars,
            pushedAt: st.pushedAt
        };
    }
    const findBySlug = (s)=>s ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apps"].find((x)=>x.slug === s) ?? null : null;
    const a = findBySlug(sp.a);
    const b = findBySlug(sp.b);
    const c = findBySlug(sp.c);
    const initial = [
        a?.slug ?? null,
        b?.slug ?? (a ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["relatedApps"])(a, 3)[0]?.slug ?? null : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apps"][0]?.slug ?? null),
        c?.slug ?? null
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$en$2d$document$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EnDocument"], {}, void 0, false, {
                fileName: "[project]/src/app/en/compare/page.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container page en-page",
                lang: "en",
                dir: "ltr",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "en-topbar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "en-brand",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "brand-grad",
                                        children: "DRS"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/en/compare/page.tsx",
                                        lineNumber: 44,
                                        columnNumber: 13
                                    }, this),
                                    " APPS & MORE"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/en/compare/page.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "en-top-actions",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/compare",
                                    className: "gh-btn",
                                    lang: "ar",
                                    dir: "rtl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__["Languages"], {
                                            size: 14,
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/en/compare/page.tsx",
                                            lineNumber: 48,
                                            columnNumber: 15
                                        }, this),
                                        " العربية"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/en/compare/page.tsx",
                                    lineNumber: 47,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/en/compare/page.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/en/compare/page.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "page-intro",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "eyebrow",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$compare$2d$arrows$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__GitCompareArrows$3e$__["GitCompareArrows"], {
                                        size: 14,
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/en/compare/page.tsx",
                                        lineNumber: 54,
                                        columnNumber: 36
                                    }, this),
                                    " Live GitHub data, refreshed hourly"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/en/compare/page.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "Compare apps"
                            }, void 0, false, {
                                fileName: "[project]/src/app/en/compare/page.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Can't decide? Put two or three DRS apps side by side and compare their status, latest releases, download counts and GitHub stars in one table — then share the comparison link with anyone."
                            }, void 0, false, {
                                fileName: "[project]/src/app/en/compare/page.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/en/compare/page.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$compare$2d$client$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CompareClient"], {
                        live: live,
                        lang: "en",
                        initial: initial
                    }, void 0, false, {
                        fileName: "[project]/src/app/en/compare/page.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/en/compare/page.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/src/app/en/compare/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/en/compare/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4364bd3d._.js.map