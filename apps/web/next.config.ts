import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vedaai/ui", "@vedaai/content", "@vedaai/types"],
};

export default nextConfig;
