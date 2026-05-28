import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vedaai/ui", "@vedaai/content", "@vedaai/types"],
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
