import { ImageResponse } from "next/og";
import { apps, categoryLabelEn } from "@/lib/catalog";

/* صورة OG لكل تطبيق (1200×630) — اسم التطبيق اللاتيني وهويته فقط (بلا خطوط عربية خارجية) */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "App | CTO-DRS";

export default async function AppOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = apps.find(item => item.slug === slug);
  const name = app?.name.en || "DRS App";
  const letter = name.charAt(0).toUpperCase();

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
        <div style={{ position: "absolute", top: -180, right: -100, width: 560, height: 560, borderRadius: 9999, background: "rgba(124,58,237,0.30)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -220, left: -120, width: 580, height: 580, borderRadius: 9999, background: "rgba(54,216,255,0.15)", display: "flex" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 58, height: 58, borderRadius: 16, background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "white", fontSize: 34, fontWeight: 900 }}>D</div>
            <span style={{ color: "#ffffff", fontSize: 30, fontWeight: 900 }}>DRS APPS &amp; MORE</span>
          </div>
          <span style={{ color: "#7dd3fc", fontSize: 20, fontWeight: 700 }}>CTO-DRS</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 170, height: 170, borderRadius: 44, background: "linear-gradient(140deg, #693ff1, #147ec1)", color: "white", fontSize: 92, fontWeight: 800, boxShadow: "0 20px 60px rgba(88,80,255,0.35)" }}>{letter}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h1 style={{ margin: 0, fontSize: 88, fontWeight: 900, color: "#f2f6ff", lineHeight: 1.1 }}>{name}</h1>
            <span style={{ color: "#8fa3c4", fontSize: 28 }}>{app ? categoryLabelEn(app.category) : "DRS catalog"}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {(app?.platforms.length ? app.platforms : ["Android"]).map(chip => (
            <div key={chip} style={{ display: "flex", padding: "12px 26px", borderRadius: 9999, border: "1px solid #223357", background: "#0b1428", color: "#c3cfe3", fontSize: 22, fontWeight: 700 }}>
              {chip}
            </div>
          ))}
          <div style={{ display: "flex", padding: "12px 26px", borderRadius: 9999, border: "1px solid #1f4a5e", background: "#0a1a26", color: "#7dd3fc", fontSize: 22, fontWeight: 700 }}>
            Open Source
          </div>
        </div>
      </div>
    ),
    size,
  );
}
