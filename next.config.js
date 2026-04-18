const path = require('path');
const { execSync } = require('child_process');

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
  turbopack: {
    root: __dirname,
    resolveAlias: {
      tailwindcss: path.join(__dirname, 'node_modules', 'tailwindcss'),
    },
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
