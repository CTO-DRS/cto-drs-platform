module.exports = [
"[project]/src/components/en-document.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EnDocument",
    ()=>EnDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function EnDocument() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        const html = document.documentElement;
        const prevLang = html.lang;
        const prevDir = html.dir;
        html.lang = "en";
        html.dir = "ltr";
        html.classList.add("en-doc");
        return ()=>{
            html.lang = prevLang;
            html.dir = prevDir;
            html.classList.remove("en-doc");
        };
    }, []);
    return null;
}
}),
];

//# sourceMappingURL=src_components_en-document_tsx_4426bcbd._.js.map