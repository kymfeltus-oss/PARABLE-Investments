import { NextRequest, NextResponse } from 'next/server';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';
import { sendPostCalBookingEmail } from '@/lib/cal-post-booking-mail';
import { verifyCalcomWebhookSignature } from '@/lib/cal-webhook-signature';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

const SUPPORTED = new Set(['BOOKING_CREATED', 'BOOKING_RESCHEDULED']);

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function asString(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v : null;
}

function extractLocation(p: Record<string, unknown>): string {
  const loc = p['location'];
  if (typeof loc === 'string') return loc;
  if (isRecord(loc) && typeof loc['value'] === 'string') return loc['value'] as string;
  return '';
}

function extractVideoUrl(p: Record<string, unknown>): string | null {
  const m = p['metadata'];
  if (!isRecord(m)) return null;
  const u = m['videoCallUrl'];
  return typeof u === 'string' && u.trim().length > 0 ? u : null;
}

/**
 * Cal.com default webhook body: { triggerEvent, createdAt, payload: eventPayload }
 * @see https://github.com/calcom/cal.com/blob/main/packages/features/webhooks/lib/sendPayload.ts
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const secret = process.env.CALCOM_WEBHOOK_SECRET?.trim() ?? '';
  if (!secret) {
    return NextResponse.json(
      { error: 'Set CALCOM_WEBHOOK_SECRET to match the secret in Cal.com (Settings → Webhooks).' },
      { status: 503 },
    );
  }

  const sig = request.headers.get('x-cal-signature-256');
  if (!verifyCalcomWebhookSignature(rawBody, sig, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!isRecord(body)) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const trigger = asString(body['triggerEvent']) ?? '';
  if (!SUPPORTED.has(trigger)) {
    return NextResponse.json({ ok: true, processed: false, reason: 'trigger_not_handled' });
  }

  const p = body['payload'];
  if (!isRecord(p)) {
    return NextResponse.json({ error: 'Missing payload' }, { status: 400 });
  }

  const calBookingUid = asString(p['uid']) ?? asString(p['iCalUID']) ?? '';
  if (!calBookingUid) {
    return NextResponse.json({ error: 'Missing booking uid' }, { status: 400 });
  }

  const attendees = p['attendees'];
  const first =
    Array.isArray(attendees) && attendees[0] && isRecord(attendees[0] as unknown)
      ? (attendees[0] as Record<string, unknown>)
      : null;
  const bookerEmailRaw = first && asString(first['email']);
  if (!bookerEmailRaw) {
    return NextResponse.json({ error: 'No booker email' }, { status: 400 });
  }
  const bookerEmail = bookerEmailRaw.trim().toLowerCase();
  if (!isValidInvestorEmail(bookerEmail)) {
    return NextResponse.json({ error: 'Invalid booker email' }, { status: 400 });
  }

  const title = asString(p['title']) || 'Parable — investor call';
  const startTime = asString(p['startTime']) ?? '';
  const endTime = asString(p['endTime']) ?? '';
  if (!startTime || !endTime) {
    return NextResponse.json({ error: 'Missing start or end time' }, { status: 400 });
  }
  const org = isRecord(p['organizer']) ? (p['organizer'] as Record<string, unknown>) : null;
  const tz =
    (first && asString(first['timeZone'])) || (org && asString(org['timeZone'])) || 'UTC';
  const location = extractLocation(p) || (extractVideoUrl(p) ? 'Video link' : '');

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Server storage is not configured for matching registrations.' },
      { status: 503 },
    );
  }

  const { data: row, error: selErr } = await admin
    .from('meeting_nda_evidence')
    .select('id, name, room_suffix, email, last_cal_notified_uid')
    .eq('email', bookerEmail)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (selErr) {
    console.error('[webhooks/cal] select failed:', selErr.message);
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({
      ok: true,
      processed: true,
      matched: false,
      message: 'No Parable /book registration for this email; no follow-up email sent.',
    });
  }

  if (trigger === 'BOOKING_CREATED' && (row as { last_cal_notified_uid?: string | null }).last_cal_notified_uid === calBookingUid) {
    return NextResponse.json({ ok: true, processed: true, matched: true, deduplicated: true });
  }

  const registrationId = typeof (row as { id?: string }).id === 'string' ? (row as { id: string }).id : null;
  const name = typeof (row as { name?: string }).name === 'string' ? (row as { name: string }).name : '';
  const roomSuffix =
    typeof (row as { room_suffix?: string | null }).room_suffix === 'string' ? (row as { room_suffix: string }).room_suffix : null;
  if (!registrationId || !name?.trim() || !roomSuffix) {
    return NextResponse.json({ ok: true, matched: true, error: 'registration_incomplete' });
  }

  const sent = await sendPostCalBookingEmail({
    toEmail: bookerEmail,
    name: name.trim(),
    registrationId,
    roomSuffix,
    cal: {
      trigger,
      title,
      startTime,
      endTime,
      timeZone: tz,
      calBookingUid,
      location,
      videoCallUrl: extractVideoUrl(p),
    },
  });

  if (sent.emailStatus === 'sent') {
    const { error: upd } = await admin
      .from('meeting_nda_evidence')
      .update({ last_cal_notified_uid: calBookingUid })
      .eq('id', registrationId);
    if (upd) {
      console.warn('[webhooks/cal] could not set last_cal_notified_uid (run schema migration?):', upd.message);
    }
  } else {
    console.warn('[webhooks/cal] post-booking email:', sent.emailStatus, sent.resendErrorMessage);
  }

  return NextResponse.json({
    ok: true,
    processed: true,
    matched: true,
    email: sent.emailStatus,
    error: sent.resendErrorMessage,
  });
}
