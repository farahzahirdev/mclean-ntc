import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // Lets a verification build run beside `next dev` without sharing .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    // Avoid stale optimized variants after replacing public/images files
    minimumCacheTTL: 0,
    qualities: [75, 90, 95, 100],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
