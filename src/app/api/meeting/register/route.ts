import { NextRequest, NextResponse } from 'next/server';
import { INVESTOR_AGREEMENT_VERSION } from '@/lib/investor-agreement-text';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';
import { getScheduledMeetUrl } from '@/lib/meeting-links';
import { sendParableInvestorMeetingConfirmation } from '@/lib/meeting-confirmation-mail';
import { generateInvestorRoomSuffix } from '@/lib/investor-room-suffix';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { mapMeetingNdaInsertError } from '@/lib/map-meeting-insert-error';

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; acknowledged?: boolean; deferEmailUntilAfterSlot?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Expected JSON body' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 320) : '';
  const deferEmailUntilAfterSlot = body.deferEmailUntilAfterSlot === true;

  if (name.length < 2) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!isValidInvestorEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!body.acknowledged) {
    return NextResponse.json(
      { error: 'Please confirm that this scheduling is under your Parable investor NDA obligations.' },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      {
        error:
          'Server storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY, and run supabase/schema-meeting-nda-evidence.sql.',
      },
      { status: 503 },
    );
  }

  const forwarded = req.headers.get('x-forwarded-for');
  const clientIp = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null;
  const userAgent = req.headers.get('user-agent')?.slice(0, 512) || null;

  let roomSuffix = generateInvestorRoomSuffix();
  let insertError: { message: string } | null = null;
  let registrationId: string | null = null;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    if (attempt > 0) {
      roomSuffix = generateInvestorRoomSuffix();
    }
    const ins = await admin
      .from('meeting_nda_evidence')
      .insert({
        name,
        email,
        nda_version: INVESTOR_AGREEMENT_VERSION,
        acknowledged: true,
        client_ip: clientIp,
        user_agent: userAgent,
        room_suffix: roomSuffix,
      })
      .select('id')
      .single();
    insertError = ins.error;
    if (!insertError && ins.data && typeof (ins.data as { id?: string }).id === 'string') {
      registrationId = (ins.data as { id: string }).id;
      break;
    }
    if (insertError?.message && /unique|duplicate/i.test(insertError.message) && attempt < 4) {
      continue;
    }
    break;
  }

  if (insertError) {
    const full = insertError as { message: string; code?: string; details?: string; hint?: string };
    console.error('[meeting/register] meeting_nda_evidence insert failed:', {
      message: full.message,
      code: full.code,
      details: full.details,
      hint: full.hint,
    });

    const { error, supabaseCode } = mapMeetingNdaInsertError(full);
    return NextResponse.json({ error, supabaseCode }, { status: 500 });
  }

  const meetUrl = getScheduledMeetUrl(roomSuffix);
  const roomLabel = `investor-${roomSuffix.replace(/^investor-/i, '')}`;
  const suffixOnly = roomSuffix.replace(/^investor-/i, '');

  if (deferEmailUntilAfterSlot) {
    return NextResponse.json({
      ok: true,
      emailStatus: 'deferred' as const,
      emailSent: false,
      registrationId,
      resendConfirmationId: null,
      resendErrorMessage: null,
      meetUrl,
      roomLabel,
      roomSuffix: suffixOnly,
    });
  }

  const sent = await sendParableInvestorMeetingConfirmation({
    name,
    email,
    roomSuffix: roomSuffix,
    logLabel: '[meeting/register]',
  });

  if (sent.emailStatus === 'sent' && registrationId) {
    const { error: updErr } = await admin
      .from('meeting_nda_evidence')
      .update({ confirmation_email_sent_at: new Date().toISOString() })
      .eq('id', registrationId);
    if (updErr) {
      console.warn('[meeting/register] could not set confirmation_email_sent_at:', updErr.message);
    }
  }

  return NextResponse.json({
    ok: true,
    emailStatus: sent.emailStatus,
    emailSent: sent.emailStatus === 'sent',
    registrationId,
    resendConfirmationId: sent.resendConfirmationId,
    resendErrorMessage: sent.resendErrorMessage,
    meetUrl,
    roomLabel,
    roomSuffix: suffixOnly,
  });
}
