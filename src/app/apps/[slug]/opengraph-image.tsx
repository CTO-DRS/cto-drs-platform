import { ImageResponse } from "next/og";
import { apps } from "@/lib/catalog";

/* صورة OG لكل تطبيق (1200×630) — تُولَّد عند البناء لكل صفحة، نص لاتيني فقط
   (خطوط next/og الافتراضية لا تدعم العربية، لذا نعتمد الاسم الإنجليزي) */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DRS App — CTO-DRS";

export default async function OgImage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolved = params instanceof Promise ? await params : params;
  const app = apps.find(item => item.slug === resolved.slug);
  const name = app?.name.en || "DRS App";
  const letter = name.slice(0, 1).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050a14",
          padding: 64,
          position: "relative",
        }}
      >
        {/* هالات خلفية بهوية المنصة */}
        <div style={{ position: "absolute", top: -170, right: -130, width: 540, height: 540, borderRadius: 9999, background: "rgba(124,58,237,0.26)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -210, left: -150, width: 560, height: 560, borderRadius: 9999, background: "rgba(54,216,255,0.14)", display: "flex" }} />

        {/* الشريط العلوي */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "white", fontSize: 34, fontWeight: 900 }}>D</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "#ffffff", fontSize: 28, fontWeight: 900 }}>DRS</span>
              <span style={{ color: "#8fa3c4", fontSize: 15, letterSpacing: 5 }}>APPS &amp; MORE</span>
            </div>
          </div>
          <span style={{ color: "#7dd3fc", fontSize: 21, fontWeight: 700 }}>CTO-DRS</span>
        </div>

        {/* بطاقة التطبيق */}
        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 190, height: 190, borderRadius: 46, background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "white", fontSize: 96, fontWeight: 900, boxShadow: "0 24px 60px rgba(124,58,237,0.45)" }}>{letter}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ color: "#36d8ff", fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>OFFICIAL APP</span>
            <span style={{ color: "#f2f6ff", fontSize: 72, fontWeight: 900, lineHeight: 1.05 }}>{name}</span>
            <div style={{ display: "flex", gap: 14 }}>
              <span style={{ color: "#c9d6ea", fontSize: 24, background: "rgba(124,58,237,0.22)", border: "2px solid rgba(124,58,237,0.55)", borderRadius: 9999, padding: "8px 26px" }}>Open Source</span>
              <span style={{ color: "#c9d6ea", fontSize: 24, background: "rgba(54,216,255,0.12)", border: "2px solid rgba(54,216,255,0.4)", borderRadius: 9999, padding: "8px 26px" }}>Android</span>
            </div>
          </div>
        </div>

        {/* الشريط السفلي */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", color: "#8fa3c4", fontSize: 22 }}>
          <span>cto-drs-store.vercel.app</span>
          <span>github.com/CTO-DRS</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
