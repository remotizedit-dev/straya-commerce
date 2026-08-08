import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow image loading from ALL remote domains (Cloudinary, AWS S3, Firebase Storage, Imgur, Unsplash, CDNs, etc.)
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
