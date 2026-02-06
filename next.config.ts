import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow query strings on local images for cache busting during development
  images: {
    localPatterns: [
      {
        pathname: "/thumbnails/**",
      },
      {
        pathname: "/projects/**",
      },
      {
        pathname: "/wallpaper/**",
      },
      {
        pathname: "/*.webp",
      },
    ],
  },

  // Increase dev server page buffer to reduce "wake up" delays during testing.
  // Default: 25s inactive / 2 pages. With 16GB RAM, we have headroom for more.
  onDemandEntries: {
    maxInactiveAge: 120 * 1000, // 2 minutes before page disposal
    pagesBufferLength: 10, // Keep 10 pages in memory
  },

  // Cache Server Component fetch() results during HMR to reduce RSC re-computation
  experimental: {
    serverComponentsHmrCache: true,
  },
};

export default nextConfig;
