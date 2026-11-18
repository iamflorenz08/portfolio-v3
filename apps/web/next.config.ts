import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compile the workspace package's TS source directly
  transpilePackages: ["@portfolio/shared"],
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // 75 is the default; 90 is used for the profile photo
    qualities: [75, 90],
  },
};

export default nextConfig;
