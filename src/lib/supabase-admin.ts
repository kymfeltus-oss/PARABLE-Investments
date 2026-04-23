import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

/** Vercel pastes often wrap values in quotes or add stray newlines — those break URL/API auth. */
function cleanSupabaseEnv(value: string | undefined): string | undefined {
  if (value == null) return undefined;
  let s = value.replace(/^\uFEFF/, '').replace(/[\r\n\t]+/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  if (s.length >= 2) {
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
      s = s.slice(1, -1).trim();
    }
  }
  return s.length > 0 ? s : undefined;
}

/** Service-role client for server routes only. Never import in client components. */
export function getSupabaseUrl(): string | undefined {
  return cleanSupabaseEnv(process.env.NEXT_PUBLIC_SUPABASE_URL) || cleanSupabaseEnv(process.env.SUPABASE_URL);
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = cleanSupabaseEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) return null;
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
