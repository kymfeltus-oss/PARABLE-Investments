import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Nested app under PARABLE repo: pin root so we don’t pick parent lockfile
    root: path.join(__dirname),
  },
};

export default nextConfig;
