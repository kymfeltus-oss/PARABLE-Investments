import type { SupabaseClient } from '@supabase/supabase-js';

/** Default tenant slug used when a request does not carry an explicit project scope. */
export const DEFAULT_PROJECT_SLUG = 'parable-seed';

export function normalizeProjectSlug(raw: unknown): string {
  const s = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  return s || DEFAULT_PROJECT_SLUG;
}

/**
 * Resolve a tenant's UUID from its slug for application-level data isolation.
 * Returns null if the registry row is missing — callers should treat that as
 * "bind nothing" (project_id is nullable) rather than hard-failing the flow.
 */
export async function resolveProjectId(
  admin: SupabaseClient,
  rawSlug: unknown,
): Promise<{ slug: string; projectId: string | null }> {
  const slug = normalizeProjectSlug(rawSlug);
  const { data } = await admin
    .from('pitchlock_projects')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  return { slug, projectId: (data as { id?: string } | null)?.id ?? null };
}
