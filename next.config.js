const { execSync } = require('child_process');
const path = require('path');

function resolveGitSha() {
  const fromEnv = process.env.NEXT_PUBLIC_GIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA;
  if (fromEnv && String(fromEnv).trim()) return String(fromEnv).trim();
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf-8', cwd: __dirname }).trim();
  } catch {
    return '';
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GIT_SHA: resolveGitSha(),
  },
  reactStrictMode: false,
  // Prefer this app root when another lockfile exists higher in the tree (e.g. user home).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;
