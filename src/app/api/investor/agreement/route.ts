import { NextRequest, NextResponse } from 'next/server';
import { getInvestorAgreementPlainText, INVESTOR_AGREEMENT_VERSION } from '@/lib/investor-agreement-text';
import { validateNdaFields } from '@/lib/investor-agreement-validation';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

function trimField(v: unknown, max: number): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      {
        error:
          'Agreement storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY, and run supabase/schema-investor-agreements.sql.',
      },
      { status: 503 }
    );
  }

  let body: { printedName?: string; signature?: string; email?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Expected JSON body' }, { status: 400 });
  }

  const printedName = trimField(body.printedName, 200);
  const signature = trimField(body.signature, 200);
  const email = trimField(body.email, 320).toLowerCase();

  const fieldErrors = validateNdaFields(printedName, signature, email);
  if (Object.keys(fieldErrors).length > 0) {
    const first =
      fieldErrors.printedName ?? fieldErrors.signature ?? fieldErrors.email ?? 'Invalid input.';
    return NextResponse.json({ error: first, fields: fieldErrors }, { status: 400 });
  }

  const documentSnapshot = getInvestorAgreementPlainText();
  const forwarded = req.headers.get('x-forwarded-for');
  const clientIp = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null;
  const userAgent = req.headers.get('user-agent')?.slice(0, 512) || null;

  const { error } = await admin.from('investor_agreements').insert({
    agreement_version: INVESTOR_AGREEMENT_VERSION,
    document_snapshot: documentSnapshot,
    printed_name: printedName,
    signature,
    email,
    client_ip: clientIp,
    user_agent: userAgent,
  });

  if (error) {
    console.error('[investor/agreement]', error.message);
    return NextResponse.json({ error: 'Could not save your agreement. Try again or contact support.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
