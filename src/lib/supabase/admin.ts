import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

let adminClient: SupabaseClient | null = null;

function getSupabaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || null;
}

function getServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;
}

/**
 * Service-role Supabase client for trusted server routes only.
 * Returns null when URL or service role key is missing.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseAdminConfigured()) return null;

  if (!adminClient) {
    const url = getSupabaseUrl();
    const key = getServiceRoleKey();
    if (!url || !key) return null;
    adminClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}

export function resetSupabaseAdminForTests(): void {
  adminClient = null;
}
