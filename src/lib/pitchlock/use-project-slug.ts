'use client';

import { useParams } from 'next/navigation';

const DEFAULT_PROJECT_SLUG = 'parable-seed';

/**
 * Reads the active tenant slug from the [projectSlug] route segment on the client.
 * Falls back to the default tenant when rendered outside a scoped route.
 */
export function useProjectSlug(): string {
  const params = useParams();
  const raw = params?.projectSlug;
  if (typeof raw === 'string' && raw.trim()) return raw;
  if (Array.isArray(raw) && typeof raw[0] === 'string' && raw[0].trim()) return raw[0];
  return DEFAULT_PROJECT_SLUG;
}
