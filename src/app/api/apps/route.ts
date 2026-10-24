import { NextResponse } from "next/server";
import { apps } from "@/lib/catalog";

/* واجهة عامة للكتالوج — بيانات الملف الوحيد src/content/apps.json دون تعديل */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=300, s-maxage=300",
};

const CSV_HEADER = [
  "slug", "name_ar", "name_en", "category", "status", "platforms",
  "version", "release_date", "pricing", "repository", "verified", "detail_url",
];

/** تهريب خلية CSV: اقتباس عند وجود فاصلة أو اقتباس أو سطر جديد */
function csvCell(value: unknown): string {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** الكتالوق كملف CSV (مع BOM لدعم العربية في Excel) */
function toCsv(): string {
  const rows = apps.map(app =>
    [
      app.slug,
      app.name.ar,
      app.name.en,
      app.category,
      app.status,
      app.platforms.join("|"),
      app.version ?? "",
      app.releaseDate ?? "",
      app.pricing ?? "free",
      app.repository ?? "",
      String(app.verified),
      `/apps/${app.slug}`,
    ].map(csvCell).join(",")
  );
  // BOM + سطر العنوان + البيانات
  return "\uFEFF" + [CSV_HEADER.join(","), ...rows].join("\n");
}

export function GET(request: Request) {
  const format = new URL(request.url).searchParams.get("format");

  if (format === "csv") {
    return new NextResponse(toCsv(), {
      headers: {
        ...CORS,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="drs-apps.csv"',
      },
    });
  }

  return NextResponse.json(
    {
      name: "CTO-DRS Apps API",
      version: "1.1.0",
      description: "كتالوج تطبيقات ومشاريع CTO-DRS — بيانات عامة فقط",
      endpoints: ["/api/apps", "/api/apps?format=csv", "/api/apps/{slug}"],
      count: apps.length,
      apps: apps.map(app => ({
        slug: app.slug,
        name: app.name,
        category: app.category,
        status: app.status,
        summary: app.summary,
        platforms: app.platforms,
        version: app.version,
        releaseDate: app.releaseDate,
        pricing: app.pricing ?? "free",
        repository: app.repository,
        website: app.website,
        verified: app.verified,
        detailUrl: `/apps/${app.slug}`,
      })),
    },
    { headers: CORS }
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}
