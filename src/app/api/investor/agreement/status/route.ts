import { NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabaseUrl } from '@/lib/supabase-admin';

/** Dev/ops: whether NDA agreement storage can accept POST (no secrets returned). */
export async function GET() {
  const hasUrl = Boolean(getSupabaseUrl());
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  const admin = getSupabaseAdmin();

  let tableReachable: boolean | null = null;
  if (admin) {
    const { error } = await admin.from('investor_agreements').select('id').limit(1);
    tableReachable = !error;
  }

  return NextResponse.json({
    configured: Boolean(admin),
    hasUrl,
    hasServiceKey,
    tableReachable,
    projectHint: hasUrl ? 'Parable Investments (rgoydmzjiktwlxufwtre)' : null,
    fix:
      !hasUrl || !hasServiceKey
        ? 'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (local) or Vercel env (production), then restart/redeploy.'
        : tableReachable === false
          ? 'Run supabase/schema-investor-agreements.sql in the Supabase SQL editor.'
          : null,
  });
}
