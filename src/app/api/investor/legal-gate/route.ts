import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { INVESTOR_AGREEMENT_VERSION } from '@/lib/investor-agreement-text';
import { getSupabaseAdmin, getSupabaseUrl } from '@/lib/supabase-admin';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const url = getSupabaseUrl();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const admin = getSupabaseAdmin();

  if (!url || !anonKey || !admin) {
    return NextResponse.json(
      {
        error:
          'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY. Run supabase/schema-legal-signatures.sql.',
      },
      { status: 503 }
    );
  }

  let body: { email?: string; acknowledged?: boolean; browserFingerprint?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Expected JSON body' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 320) : '';
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (!body.acknowledged) {
    return NextResponse.json({ error: 'You must acknowledge the agreement.' }, { status: 400 });
  }

  const browserFingerprint =
    typeof body.browserFingerprint === 'string' ? body.browserFingerprint.slice(0, 512) : '';

  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null;

  const { error: insertError } = await admin.from('legal_signatures').insert({
    email,
    nda_version: INVESTOR_AGREEMENT_VERSION,
    ip_address: ip,
    browser_info: browserFingerprint || null,
  });

  if (insertError) {
    console.error('[legal-gate]', insertError.message);
    return NextResponse.json({ error: 'Could not record your acknowledgment.' }, { status: 500 });
  }

  const origin = new URL(req.url).origin;
  const supabaseAuth = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent('/investor/page-2')}`;

  const { error: otpError } = await supabaseAuth.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (otpError) {
    console.error('[legal-gate otp]', otpError.message);
    return NextResponse.json(
      {
        error:
          'Your acknowledgment was saved, but we could not send the verification email. Check Supabase Auth settings and try again.',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
