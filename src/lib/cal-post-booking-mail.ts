import { Resend } from 'resend';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';
import { getScheduledMeetUrl } from '@/lib/meeting-links';

const CONTACT = process.env.NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL ?? 'investors@parableinvestments.com';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeHtmlAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function normalizeResendFromEmailEnv(value: string): string {
  let v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"') && v.length > 1) ||
    (v.startsWith("'") && v.endsWith("'") && v.length > 1)
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

function sanitizeResendFromHeader(value: string): string {
  let v = normalizeResendFromEmailEnv(value);
  v = v
    .replace(/^\uFEFF/, '')
    .replace(/\uFEFF/g, '')
    .replace(/[\u200B-\u200D]/g, '')
    .trim();
  if (!v.includes('<')) {
    v = v.replace(/[\n\r\t]+/g, '').replace(/\s+/g, ' ').trim();
    if (v.includes('@')) v = v.toLowerCase();
    return v;
  }
  const m = v.match(/^(.*)<\s*([^>]+)>\s*$/);
  if (!m) return v;
  const addr = m[2]
    .trim()
    .replace(/[\n\r\t\s]+/g, '')
    .toLowerCase();
  return `${m[1].trim()} <${addr}>`;
}

function toResendApiFrom(sanitized: string): string | null {
  if (!sanitized) return null;
  if (sanitized.trim().startsWith('re_')) {
    return null;
  }
  const m = sanitized.match(/<([^>]+)>\s*$/);
  const raw = (m ? m[1] : sanitized).trim();
  return isValidInvestorEmail(raw) ? raw.toLowerCase() : null;
}

function pickResendError(e: { message?: string; name?: string } | null | undefined): string {
  if (!e) return 'Unknown Resend error';
  const m = e.message?.trim() || e.name || 'Resend rejected the request';
  return m.length > 600 ? `${m.slice(0, 600)}…` : m;
}

function formatWhen(isoStart: string, isoEnd: string, tz: string): string {
  try {
    const s = new Date(isoStart);
    const e = new Date(isoEnd);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return `${isoStart} – ${isoEnd} (${tz})`;
    const zone = tz || 'UTC';
    return `${s.toLocaleString('en-US', { timeZone: zone, dateStyle: 'medium', timeStyle: 'short' })} – ${e.toLocaleString(
      'en-US',
      { timeZone: zone, timeStyle: 'short' },
    )} (${zone})`;
  } catch {
    return `${isoStart} – ${isoEnd} (${tz})`;
  }
}

function resolveResendFrom(): string | undefined {
  const fromEnv = process.env.RESEND_FROM_EMAIL ? sanitizeResendFromHeader(process.env.RESEND_FROM_EMAIL) : '';
  const fromContact = sanitizeResendFromHeader(CONTACT);
  return toResendApiFrom(fromEnv) ?? toResendApiFrom(fromContact) ?? undefined;
}

export type CalPostBookingEmailResult = {
  emailStatus: 'sent' | 'unconfigured' | 'failed';
  resendErrorMessage: string | null;
};

/**
 * Follow-up after Cal.com `BOOKING_CREATED` / `BOOKING_RESCHEDULED`: time from Cal + Parable room from our DB.
 */
export async function sendPostCalBookingEmail(params: {
  toEmail: string;
  name: string;
  registrationId: string;
  roomSuffix: string;
  cal: {
    trigger: string;
    title: string;
    startTime: string;
    endTime: string;
    timeZone: string;
    calBookingUid: string;
    location: string;
    videoCallUrl: string | null;
  };
}): Promise<CalPostBookingEmailResult> {
  const { toEmail, name, registrationId, roomSuffix, cal: cald } = params;
  const suffix = roomSuffix.replace(/^investor-/i, '');
  const roomLabel = `investor-${suffix}`;
  const meetUrl = getScheduledMeetUrl(suffix);
  const when = formatWhen(cald.startTime, cald.endTime, cald.timeZone);

  const subject =
    cald.trigger === 'BOOKING_RESCHEDULED'
      ? 'Parable — your meeting was rescheduled (time + room details)'
      : 'Parable — you booked a time (Cal.com) — room & meeting details';

  const text = [
    `Hi ${name},`,
    '',
    `This message was sent after your ${cald.trigger === 'BOOKING_RESCHEDULED' ? 'rescheduled' : 'new'} Cal.com booking.`,
    '',
    'Time (from Cal.com)',
    `— ${cald.title}`,
    `— ${when}`,
    `— Cal.com booking id: ${cald.calBookingUid}`,
    cald.location ? `— Cal.com location: ${cald.location}` : '',
    cald.videoCallUrl ? `— Cal.com video / conference link: ${cald.videoCallUrl}` : '',
    '',
    'Parable (investor) — meeting IDs and video room',
    `— Parable registration id: ${registrationId}`,
    `— Host / meeting id (full): ${roomLabel}`,
    `— Room suffix (after "investor-"): ${suffix}`,
    `— Parable video room: ${meetUrl}`,
    '',
    'For the Parable video call, use the Parable video room link above with the same email you used when you registered, unless the team said otherwise. Cal.com may have its own "Where" link; that is separate from Parable.',
    '',
    '— Parable',
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
  <div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.5;color:#111">
    <h1 style="font-size:18px;">${escapeHtml(subject)}</h1>
    <p>Hi ${escapeHtml(name)},</p>
    <p>Your calendar booking was updated. Below is the <strong>time from Cal.com</strong> and your <strong>Parable meeting ids &amp; room link</strong> (same as your registration).</p>
    <p style="padding:0.75rem 1rem;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;font-size:14px">
      <strong>Time — Cal.com</strong><br/>
      <span style="color:#444"><strong>Title:</strong> ${escapeHtml(cald.title)}</span><br/>
      <span style="color:#444"><strong>When:</strong> ${escapeHtml(when)}</span><br/>
      <span style="color:#444"><strong>Cal.com booking id:</strong></span>
      <code style="display:block;margin:0.35rem 0;font-size:12px;word-break:break-all;background:#fff;padding:0.4rem;border-radius:4px;border:1px solid #ddd">${escapeHtml(cald.calBookingUid)}</code>
      ${cald.location ? `<span style="color:#444"><strong>Location in Cal.com:</strong> ${escapeHtml(cald.location)}</span><br/>` : ''}
      ${
        cald.videoCallUrl
          ? `<a href="${escapeHtmlAttr(cald.videoCallUrl)}" style="display:inline-block;margin-top:0.4rem">Cal.com conference link</a>`
          : ''
      }
    </p>
    <p style="padding:0.75rem 1rem;background:#fafafa;border:1px solid #eee;border-radius:8px;font-size:14px">
      <strong>Parable — meeting ids</strong><br/>
      <span style="color:#444"><strong>Registration id:</strong></span>
      <code style="display:block;margin:0.35rem 0;font-size:12px;word-break:break-all;background:#fff;padding:0.4rem;border-radius:4px;border:1px solid #ddd">${escapeHtml(registrationId)}</code>
      <span style="color:#444"><strong>Host / meeting id:</strong></span>
      <code style="display:block;margin:0.35rem 0;font-size:12px;word-break:break-all;background:#fff;padding:0.4rem;border-radius:4px;border:1px solid #ddd">${escapeHtml(roomLabel)}</code>
      <span style="color:#444"><strong>Room suffix:</strong></span>
      <code style="display:block;margin:0.35rem 0;font-size:12px;word-break:break-all;background:#fff;padding:0.4rem;border-radius:4px;border:1px solid #ddd">${escapeHtml(suffix)}</code>
    </p>
    <p><strong>Parable video room</strong><br/>
    <a href="${escapeHtmlAttr(meetUrl)}">${escapeHtml(meetUrl)}</a></p>
    <p style="font-size:12px;color:#666">This email was triggered by your Cal.com ${escapeHtml(
      cald.trigger === 'BOOKING_RESCHEDULED' ? 'reschedule' : 'booking',
    )}. It does not change your NDA record. Not legal advice.</p>
  </div>`;

  const resendKey = process.env.RESEND_API_KEY;
  const from = resolveResendFrom();

  if (!resendKey || !from) {
    console.warn(
      '[cal-post-booking-mail] No Resend: set RESEND_API_KEY and a valid RESEND_FROM_EMAIL (or valid NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL for From).',
    );
    return { emailStatus: 'unconfigured', resendErrorMessage: null };
  }

  try {
    const resend = new Resend(resendKey);
    const result = await resend.emails.send({ from, to: toEmail, subject, text, html });
    if (result.error) {
      return { emailStatus: 'failed', resendErrorMessage: pickResendError(result.error) };
    }
    const teamResult = await resend.emails.send({
      from,
      to: CONTACT,
      subject: `[Cal ${cald.trigger}] ${name} — ${cald.title}`,
      html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(toEmail)}&gt; booked (Cal webhook).</p>
      <p>Cal id: <code>${escapeHtml(cald.calBookingUid)}</code></p>
      <p>When: ${escapeHtml(when)}</p>
      <p>Parable registration: <code>${escapeHtml(registrationId)}</code> — <a href="${escapeHtmlAttr(meetUrl)}">join</a></p>`,
    });
    if (teamResult.error) {
      console.error('[cal-post-booking-mail] team notify failed:', teamResult.error.message ?? teamResult.error);
    }
    return { emailStatus: 'sent', resendErrorMessage: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { emailStatus: 'failed', resendErrorMessage: msg.length > 600 ? `${msg.slice(0, 600)}…` : msg };
  }
}
