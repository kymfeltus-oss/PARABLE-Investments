import { timingSafeEqual } from 'crypto';
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

function isMeetingMasterKeyValid(provided: string): boolean {
  const expected = process.env.MEETING_MASTER_KEY?.trim();
  if (!expected || !provided) return false;
  try {
    const a = Buffer.from(provided, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  let body: {
    email?: string;
    roomSuffix?: string;
    masterKey?: string;
    participantName?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Expected JSON body' }, { status: 400 });
  }

  const roomSuffix = typeof body.roomSuffix === 'string' ? normalizeSuffix(body.roomSuffix) : '';
  const masterKey = typeof body.masterKey === 'string' ? body.masterKey : '';
  const masterName =
    typeof body.participantName === 'string' ? body.participantName.trim().slice(0, 80) : '';

  if (isMeetingMasterKeyValid(masterKey)) {
    if (!roomSuffix) {
      return NextResponse.json({ error: 'Room is missing.' }, { status: 400 });
    }
    if (!masterName) {
      return NextResponse.json({ error: 'Enter your display name for the call.' }, { status: 400 });
    }
    return NextResponse.json({ ok: true, participantName: masterName });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Server not configured. Set Supabase credentials for investor meeting verification.' },
      { status: 503 }
    );
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

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
