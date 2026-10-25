(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/en-document.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EnDocument",
    ()=>EnDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function EnDocument() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "EnDocument.useLayoutEffect": ()=>{
            const html = document.documentElement;
            const prevLang = html.lang;
            const prevDir = html.dir;
            html.lang = "en";
            html.dir = "ltr";
            html.classList.add("en-doc");
            return ({
                "EnDocument.useLayoutEffect": ()=>{
                    html.lang = prevLang;
                    html.dir = prevDir;
                    html.classList.remove("en-doc");
                }
            })["EnDocument.useLayoutEffect"];
        }
    }["EnDocument.useLayoutEffect"], []);
    return null;
}
_s(EnDocument, "n7/vCynhJvM+pLkyL2DMQUF0odM=");
_c = EnDocument;
var _c;
__turbopack_context__.k.register(_c, "EnDocument");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_en-document_tsx_9e6b34fe._.js.map