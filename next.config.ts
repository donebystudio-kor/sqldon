import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/terms', destination: '/concept', permanent: true },
      { source: '/terms/:slug', destination: '/concept/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
