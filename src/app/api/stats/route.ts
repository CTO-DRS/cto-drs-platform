import { NextResponse } from "next/server";
import { apps, catalogStats } from "@/lib/catalog";
import { openSourceCount, parseGithubRepo } from "@/lib/github";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/** GET /api/stats — إحصاءات مجمعة للكتالوج (حقيقية 100% من ملف الكتالوج) */
export async function GET() {
  const repos = Array.from(
    new Set(apps.map(a => parseGithubRepo(a.repository)).filter(Boolean).map(r => `${r!.owner}/${r!.repo}`))
  );

  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      catalog: {
        total: catalogStats.total,
        released: catalogStats.released,
        inDevelopment: catalogStats.inDevelopment,
        categories: catalogStats.categories,
        platforms: catalogStats.platforms,
      },
      openSource: {
        linkedApps: openSourceCount(apps),
        repositories: repos,
      },
      categories: Object.fromEntries(
        [...new Set(apps.map(a => a.category))].map(cat => [cat, apps.filter(a => a.category === cat).length])
      ),
    },
    { headers: CORS }
  );
}
