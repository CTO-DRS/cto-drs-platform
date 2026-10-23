import { NextResponse } from "next/server";
import { apps } from "@/lib/catalog";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=300, s-maxage=300",
};

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const app = apps.find(item => item.slug === slug);
  if (!app) {
    return NextResponse.json({ error: "app_not_found", slug }, { status: 404, headers: CORS });
  }
  return NextResponse.json(app, { headers: CORS });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}
