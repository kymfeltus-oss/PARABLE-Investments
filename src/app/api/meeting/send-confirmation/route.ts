import { NextRequest, NextResponse } from 'next/server';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';
import { sendParableInvestorMeetingConfirmation } from '@/lib/meeting-confirmation-mail';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  let body: { registrationId?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Expected JSON body' }, { status: 400 });
  }

  const registrationId = typeof body.registrationId === 'string' ? body.registrationId.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 320) : '';

  if (!/^[0-9a-f-]{36}$/i.test(registrationId)) {
    return NextResponse.json({ error: 'Invalid registration id.' }, { status: 400 });
  }
  if (!isValidInvestorEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Server storage is not configured.' },
      { status: 503 },
    );
  }

  const { data: row, error: fetchError } = await admin
    .from('meeting_nda_evidence')
    .select('id, email, name, room_suffix, confirmation_email_sent_at')
    .eq('id', registrationId)
    .eq('email', email)
    .maybeSingle();

  if (fetchError) {
    console.error('[meeting/send-confirmation] select failed:', fetchError.message);
    return NextResponse.json({ error: 'Could not load your registration. Try again.' }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json(
      { error: 'No matching registration for this id and email.' },
      { status: 404 },
    );
  }

  if (row.confirmation_email_sent_at) {
    return NextResponse.json({
      ok: true,
      emailStatus: 'already_sent' as const,
      emailSent: true,
      resendConfirmationId: null,
      resendErrorMessage: null,
    });
  }

  const name = typeof row.name === 'string' ? row.name : '';
  const roomSuffix = typeof row.room_suffix === 'string' ? row.room_suffix : '';
  if (!name.trim() || !roomSuffix) {
    return NextResponse.json({ error: 'Registration is incomplete. Register again from Book a meeting.' }, { status: 400 });
  }

  const sent = await sendParableInvestorMeetingConfirmation({
    name: name.trim(),
    email: row.email as string,
    roomSuffix,
    logLabel: '[meeting/send-confirmation]',
  });

  if (sent.emailStatus === 'sent') {
    const { error: updErr } = await admin
      .from('meeting_nda_evidence')
      .update({ confirmation_email_sent_at: new Date().toISOString() })
      .eq('id', registrationId)
      .is('confirmation_email_sent_at', null);
    if (updErr) {
      console.warn('[meeting/send-confirmation] could not set confirmation_email_sent_at:', updErr.message);
    }
  }

  return NextResponse.json({
    ok: true,
    emailStatus: sent.emailStatus,
    emailSent: sent.emailStatus === 'sent',
    resendConfirmationId: sent.resendConfirmationId,
    resendErrorMessage: sent.resendErrorMessage,
  });
}
