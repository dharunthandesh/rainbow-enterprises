import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Optimized: serve WebP/AVIF at correct sizes for sharp rendering
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1440, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.rootsveyr.com",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "rootsveyr.com",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
