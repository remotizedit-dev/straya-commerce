import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Universal image loading support for ANY domain, CDN, host, or protocol
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
