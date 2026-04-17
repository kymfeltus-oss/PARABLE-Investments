import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** This app lives inside a repo that has another package-lock.json above it; pin Turbopack root here. */
const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: configDir,
  },
};

export default nextConfig;
