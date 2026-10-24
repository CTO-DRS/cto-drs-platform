import { ImageResponse } from "next/og";

/* صورة OG الافتراضية للموقع (1200×630) — هوية داكنة متدرجة، نص لاتيني فقط */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DRS Apps & More — CTO-DRS";

export default function OgImage() {
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
        {/* هالات خلفية */}
        <div style={{ position: "absolute", top: -160, right: -120, width: 520, height: 520, borderRadius: 9999, background: "rgba(124,58,237,0.28)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -200, left: -140, width: 560, height: 560, borderRadius: 9999, background: "rgba(54,216,255,0.16)", display: "flex" }} />

        {/* الشريط العلوي */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "white", fontSize: 40, fontWeight: 900 }}>D</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "#ffffff", fontSize: 34, fontWeight: 900 }}>DRS</span>
              <span style={{ color: "#8fa3c4", fontSize: 18, letterSpacing: 6 }}>APPS &amp; MORE</span>
            </div>
          </div>
          <span style={{ color: "#7dd3fc", fontSize: 22, fontWeight: 700 }}>github.com/CTO-DRS</span>
        </div>

        {/* العنوان */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <h1 style={{ margin: 0, display: "flex", flexDirection: "column", gap: 6, fontWeight: 900, lineHeight: 1.15, fontSize: 84, color: "#f2f6ff" }}>
            <span>All your apps,</span>
            <span style={{ color: "#36d8ff" }}>one place</span>
          </h1>
          <p style={{ margin: 0, color: "#a7b5cc", fontSize: 30, lineHeight: 1.5 }}>
            Apps catalog · documented projects · live open-source repositories
          </p>
        </div>

        {/* الشرائط السفلية */}
        <div style={{ display: "flex", gap: 16 }}>
          {["Android", "Web", "Open Source", "Honest data"].map(chip => (
            <div key={chip} style={{ display: "flex", alignItems: "center", padding: "12px 26px", borderRadius: 9999, border: "1px solid #223357", background: "#0b1428", color: "#c3cfe3", fontSize: 22, fontWeight: 700 }}>
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
