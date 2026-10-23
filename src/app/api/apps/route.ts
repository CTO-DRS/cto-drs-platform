import { NextResponse } from "next/server";
import { apps } from "@/lib/catalog";

/* واجهة عامة للكتالوج — بيانات الملف الوحيد src/content/apps.json دون تعديل */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=300, s-maxage=300",
};

export function GET() {
  return NextResponse.json(
    {
      name: "CTO-DRS Apps API",
      version: "1.0.0",
      description: "كتالوج تطبيقات ومشاريع CTO-DRS — بيانات عامة فقط",
      endpoints: ["/api/apps", "/api/apps/{slug}"],
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
