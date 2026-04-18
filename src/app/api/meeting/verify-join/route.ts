import { NextRequest, NextResponse } from 'next/server';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';
import { getDefaultScheduledRoomSuffix } from '@/lib/meeting-links';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

function normalizeSuffix(raw: string): string {
  return raw
    .trim()
    .replace(/^investor-/i, '')
    .replace(/[^a-zA-Z0-9_-]/g, '');
}

export async function POST(req: NextRequest) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Server not configured. Set Supabase credentials for investor meeting verification.' },
      { status: 503 }
    );
  }

  let body: { email?: string; roomSuffix?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Expected JSON body' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const roomSuffix = typeof body.roomSuffix === 'string' ? normalizeSuffix(body.roomSuffix) : '';

  if (!isValidInvestorEmail(email)) {
    return NextResponse.json(
      { error: 'Enter the same work email we have on file from your booking confirmation.' },
      { status: 400 }
    );
  }
  if (!roomSuffix) {
    return NextResponse.json({ error: 'Room is missing.' }, { status: 400 });
  }

  const expected = normalizeSuffix(getDefaultScheduledRoomSuffix());
  if (roomSuffix !== expected) {
    return NextResponse.json(
      {
        error:
          'This room does not match your confirmation email. Use the video link from the email we sent you.',
      },
      { status: 403 }
    );
  }

  const { data, error } = await admin
    .from('meeting_nda_evidence')
    .select('name')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('[verify-join]', error.message);
    return NextResponse.json({ error: 'Could not verify. Try again.' }, { status: 500 });
  }

  if (!data?.name?.trim()) {
    return NextResponse.json(
      {
        error:
          'No investor meeting registration found for this email. Use the same email you entered on Book a meeting.',
      },
      { status: 403 }
    );
  }

  const participantName = data.name.trim().slice(0, 80) || 'Guest';

  return NextResponse.json({ ok: true, participantName });
}
