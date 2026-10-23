import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "CTO-DRS Apps API",
    version: "1.0.0",
    endpoints: {
      catalog: "/api/apps",
      app: "/api/apps/{slug}",
    },
    docs: "/docs",
  });
}
