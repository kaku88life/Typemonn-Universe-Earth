import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.atlasacademy.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.atlasacademy.io',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

