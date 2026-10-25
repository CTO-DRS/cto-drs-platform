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
"[project]/src/components/update-checker.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UpdateChecker",
    ()=>UpdateChecker
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const UpdateChecker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call UpdateChecker() from the server but UpdateChecker is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/update-checker.tsx <module evaluation>", "UpdateChecker");
}),
"[project]/src/components/update-checker.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UpdateChecker",
    ()=>UpdateChecker
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const UpdateChecker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call UpdateChecker() from the server but UpdateChecker is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/update-checker.tsx", "UpdateChecker");
}),
"[project]/src/components/update-checker.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$update$2d$checker$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/update-checker.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$update$2d$checker$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/update-checker.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$update$2d$checker$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
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
"[project]/src/components/app-glyph.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppGlyph",
    ()=>AppGlyph
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AppGlyph = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AppGlyph() from the server but AppGlyph is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/app-glyph.tsx <module evaluation>", "AppGlyph");
}),
"[project]/src/components/app-glyph.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppGlyph",
    ()=>AppGlyph
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const AppGlyph = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call AppGlyph() from the server but AppGlyph is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/app-glyph.tsx", "AppGlyph");
}),
"[project]/src/components/app-glyph.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$app$2d$glyph$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/app-glyph.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$app$2d$glyph$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/app-glyph.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$app$2d$glyph$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/updates/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UpdatesPage,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-rsc] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-rsc] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-rsc] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rss$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Rss$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rss.js [app-rsc] (ecmascript) <export default as Rss>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-rsc] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-rsc] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flame.js [app-rsc] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-rsc] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/catalog.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/github.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$update$2d$checker$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/update-checker.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$release$2d$alerts$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/release-alerts.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$back$2d$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/back-button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$app$2d$glyph$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/app-glyph.tsx [app-rsc] (ecmascript)");
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
    title: "ما الجديد — أحدث الإصدارات الحية",
    description: "تغذية حية من GitHub: أحدث إصدارات جميع تطبيقات DRS مرتبة زمنيًا مع ملاحظات كل إصدار وفاحص تحديثات لمقارنة نسختك بأحدث وسم منشور."
};
async function UpdatesPage() {
    /* مراجع مستودعات الكتالوق لجلب التغذية المجمعة */ const repoRefs = [];
    for (const a of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apps"]){
        const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseGithubRepo"])(a.repository);
        if (ref) repoRefs.push(ref);
    }
    const [feed, statsMap] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchRecentReleasesFeed"])(repoRefs, 3, 14),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchCatalogRepoStats"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apps"])
    ]);
    /* إحصاءات حقيقية مشتقة من التغذية فقط */ const now = Date.now();
    const last30 = feed.filter((r)=>r.publishedAt && now - Date.parse(r.publishedAt) < 30 * 24 * 60 * 60 * 1000).length;
    const perRepo = new Map();
    for (const r of feed)perRepo.set(r.repo, (perRepo.get(r.repo) || 0) + 1);
    const topRepo = Array.from(perRepo.entries()).sort((a, b)=>b[1] - a[1])[0];
    const topApp = topRepo ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apps"].find((a)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseGithubRepo"])(a.repository)?.repo === topRepo[0]) ?? null : null;
    /* خيارات فاحص التحديثات: كل التطبيقات مرتبة بأحدث إصدار */ const checkerApps = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apps"].map((a)=>{
        const st = statsMap[a.slug];
        const dl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firstDownload"])(a);
        return {
            slug: a.slug,
            name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appName"])(a),
            latestTag: st?.latestTag ?? null,
            releasedAt: st?.releasedAt ?? null,
            apkUrl: dl && dl.kind === "apk" ? dl.url : null
        };
    }).sort((a, b)=>(b.releasedAt ?? "").localeCompare(a.releasedAt ?? ""));
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cto-drs.com";
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "ما الجديد — أحدث إصدارات تطبيقات DRS",
        url: `${siteUrl}/updates`,
        inLanguage: "ar",
        description: "سجل حي لأحدث إصدارات تطبيقات DRS من مستودعات GitHub الرسمية."
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "container page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify(jsonLd)
                }
            }, void 0, false, {
                fileName: "[project]/src/app/updates/page.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "breadcrumbs-row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "breadcrumbs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                children: "الرئيسية"
                            }, void 0, false, {
                                fileName: "[project]/src/app/updates/page.tsx",
                                lineNumber: 66,
                                columnNumber: 38
                            }, this),
                            " / ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-current": "page",
                                children: "ما الجديد"
                            }, void 0, false, {
                                fileName: "[project]/src/app/updates/page.tsx",
                                lineNumber: 66,
                                columnNumber: 71
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/updates/page.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$back$2d$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BackButton"], {
                        fallback: "/",
                        label: "رجوع"
                    }, void 0, false, {
                        fileName: "[project]/src/app/updates/page.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/updates/page.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-intro",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "eyebrow",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                size: 13,
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/app/updates/page.tsx",
                                lineNumber: 71,
                                columnNumber: 34
                            }, this),
                            " تحديث كل ساعة من GitHub"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/updates/page.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "ما الجديد؟"
                    }, void 0, false, {
                        fileName: "[project]/src/app/updates/page.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "سجل حي يجمع أحدث إصدارات جميع تطبيقات الكتالوج من مستودعات GitHub الرسمية — ملاحظات كل إصدار وتاريخه ورابط تحميله في مكان واحد."
                    }, void 0, false, {
                        fileName: "[project]/src/app/updates/page.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/updates/page.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "updates-layout",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "updates-feed",
                        "aria-label": "تغذية الإصدارات الحية",
                        children: feed.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                            className: "feed-list",
                            children: feed.map((rel)=>{
                                const app = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apps"].find((a)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseGithubRepo"])(a.repository)?.repo === rel.repo) ?? null;
                                const apk = app ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firstDownload"])(app) : null;
                                const apkUrl = apk && apk.kind === "apk" ? apk.url : null;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "feed-item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "feed-dot",
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/updates/page.tsx",
                                            lineNumber: 89,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: "feed-card",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                                    className: "feed-head",
                                                    children: [
                                                        app && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                                            className: "feed-app",
                                                            href: `/apps/${app.slug}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "app-icon mini",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$app$2d$glyph$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AppGlyph"], {
                                                                        appIcon: app.appIcon,
                                                                        letter: app.name.en.slice(0, 1)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/updates/page.tsx",
                                                                        lineNumber: 94,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/updates/page.tsx",
                                                                    lineNumber: 94,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appName"])(app)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/updates/page.tsx",
                                                                    lineNumber: 95,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/updates/page.tsx",
                                                            lineNumber: 93,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "feed-tag",
                                                            dir: "ltr",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                                    size: 12,
                                                                    "aria-hidden": true
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/updates/page.tsx",
                                                                    lineNumber: 98,
                                                                    columnNumber: 62
                                                                }, this),
                                                                " ",
                                                                rel.tag
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/updates/page.tsx",
                                                            lineNumber: 98,
                                                            columnNumber: 25
                                                        }, this),
                                                        rel.prerelease && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "tag pre",
                                                            children: "معاينة"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/updates/page.tsx",
                                                            lineNumber: 99,
                                                            columnNumber: 44
                                                        }, this),
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isFreshRelease"])(rel.publishedAt) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "tag new-badge",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                    size: 11,
                                                                    "aria-hidden": true
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/updates/page.tsx",
                                                                    lineNumber: 100,
                                                                    columnNumber: 93
                                                                }, this),
                                                                " جديد"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/updates/page.tsx",
                                                            lineNumber: 100,
                                                            columnNumber: 61
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/updates/page.tsx",
                                                    lineNumber: 91,
                                                    columnNumber: 23
                                                }, this),
                                                rel.name && rel.name !== rel.tag && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "feed-title",
                                                    children: rel.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/updates/page.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 60
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("time", {
                                                    className: "feed-date",
                                                    dateTime: rel.publishedAt ?? undefined,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                            size: 12,
                                                            "aria-hidden": true
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/updates/page.tsx",
                                                            lineNumber: 104,
                                                            columnNumber: 25
                                                        }, this),
                                                        " ",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatDateAr"])(rel.publishedAt)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/updates/page.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 23
                                                }, this),
                                                rel.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "feed-notes",
                                                    children: rel.notes
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/updates/page.tsx",
                                                    lineNumber: 106,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                                    className: "feed-actions",
                                                    children: [
                                                        apkUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            className: "button primary sm",
                                                            href: apkUrl,
                                                            target: "_blank",
                                                            rel: "noreferrer",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                    size: 13,
                                                                    "aria-hidden": true
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/updates/page.tsx",
                                                                    lineNumber: 110,
                                                                    columnNumber: 29
                                                                }, this),
                                                                " تحميل APK"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/updates/page.tsx",
                                                            lineNumber: 109,
                                                            columnNumber: 27
                                                        }, this),
                                                        app && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                                            className: "button secondary sm",
                                                            href: `/apps/${app.slug}`,
                                                            children: "صفحة التطبيق"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/updates/page.tsx",
                                                            lineNumber: 113,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            className: "text-link",
                                                            href: rel.url,
                                                            target: "_blank",
                                                            rel: "noreferrer",
                                                            children: [
                                                                "الإصدار على GitHub ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    "aria-hidden": true,
                                                                    children: "↗"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/updates/page.tsx",
                                                                    lineNumber: 115,
                                                                    columnNumber: 46
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/updates/page.tsx",
                                                            lineNumber: 114,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/updates/page.tsx",
                                                    lineNumber: 107,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/updates/page.tsx",
                                            lineNumber: 90,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, `${rel.repo}-${rel.tag}`, true, {
                                    fileName: "[project]/src/app/updates/page.tsx",
                                    lineNumber: 88,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/app/updates/page.tsx",
                            lineNumber: 82,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "empty-state",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rss$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Rss$3e$__["Rss"], {
                                    size: 34,
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/app/updates/page.tsx",
                                    lineNumber: 125,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                    children: "لا توجد إصدارات معروضة الآن"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/updates/page.tsx",
                                    lineNumber: 126,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "تعذر جلب التغذية من GitHub في هذه اللحظة — أعد المحاولة بعد قليل."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/updates/page.tsx",
                                    lineNumber: 127,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/updates/page.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/updates/page.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "updates-side",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "panel updates-pulse",
                                "aria-label": "نبض الإصدارات",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                                size: 16,
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/updates/page.tsx",
                                                lineNumber: 134,
                                                columnNumber: 17
                                            }, this),
                                            " نبض الإصدارات"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/updates/page.tsx",
                                        lineNumber: 134,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pulse-grid",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pulse-cell",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: feed.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/updates/page.tsx",
                                                        lineNumber: 137,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "إصدارًا في السجل"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/updates/page.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/updates/page.tsx",
                                                lineNumber: 136,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pulse-cell",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: last30
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/updates/page.tsx",
                                                        lineNumber: 141,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "خلال آخر 30 يومًا"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/updates/page.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/updates/page.tsx",
                                                lineNumber: 140,
                                                columnNumber: 15
                                            }, this),
                                            topApp && topRepo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pulse-cell wide",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"], {
                                                                size: 14,
                                                                "aria-hidden": true
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/updates/page.tsx",
                                                                lineNumber: 146,
                                                                columnNumber: 22
                                                            }, this),
                                                            " ",
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$catalog$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["appName"])(topApp)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/updates/page.tsx",
                                                        lineNumber: 146,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "الأكثر نشاطًا (",
                                                            topRepo[1],
                                                            " إصدارات معروضة)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/updates/page.tsx",
                                                        lineNumber: 147,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/updates/page.tsx",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/updates/page.tsx",
                                        lineNumber: 135,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/updates/page.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$release$2d$alerts$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ReleaseAlerts"], {
                                apps: checkerApps
                            }, void 0, false, {
                                fileName: "[project]/src/app/updates/page.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$update$2d$checker$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UpdateChecker"], {
                                apps: checkerApps
                            }, void 0, false, {
                                fileName: "[project]/src/app/updates/page.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "panel",
                                "aria-label": "متابعة الإصدارات",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rss$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Rss$3e$__["Rss"], {
                                                size: 16,
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/updates/page.tsx",
                                                lineNumber: 158,
                                                columnNumber: 17
                                            }, this),
                                            " تابع الإصدارات"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/updates/page.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "أضف تغذية أي تطبيق إلى قارئ RSS لديك لتصلك الإصدارات أولًا بأول، أو زر صفحة الإصدارات المجمعة على GitHub."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/updates/page.tsx",
                                        lineNumber: 159,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        className: "button secondary full",
                                        href: "https://github.com/CTO-DRS/releases",
                                        target: "_blank",
                                        rel: "noreferrer",
                                        children: [
                                            "كل إصدارات الحساب ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                "aria-hidden": true,
                                                children: "↗"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/updates/page.tsx",
                                                lineNumber: 161,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/updates/page.tsx",
                                        lineNumber: 160,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                        className: "text-link",
                                        href: "/apps",
                                        children: [
                                            "تصفح الكتالوق كاملًا ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                size: 14,
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/updates/page.tsx",
                                                lineNumber: 164,
                                                columnNumber: 36
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/updates/page.tsx",
                                        lineNumber: 163,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/updates/page.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/updates/page.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/updates/page.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/updates/page.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/updates/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/updates/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e6564990._.js.map