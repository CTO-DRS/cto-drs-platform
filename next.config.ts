import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  /* تحويلات دائمة للروابط القديمة بعد مطابقة أسماء التطبيقات مع مستودعات GitHub الحقيقية */
  async redirects() {
    return [
      { source: "/apps/clearcut", destination: "/apps/lumina-studio", permanent: true },
      { source: "/apps/mohasabi", destination: "/apps/superbiz", permanent: true },
    ];
  },
};

export default nextConfig;
