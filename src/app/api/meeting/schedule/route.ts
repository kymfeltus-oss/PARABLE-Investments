import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { buildIcsCalendar } from '@/lib/ics';
import { getDefaultScheduledRoomSuffix, getPublicSiteOrigin, getScheduledMeetUrl } from '@/lib/meeting-links';

const CONTACT = process.env.NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL ?? 'investors@parableinvestments.com';

type Body = {
  name?: string;
  email?: string;
  startIso?: string;
  endIso?: string;
  timezone?: string;
  notes?: string;
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Expected JSON body' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 320) : '';
  const tz = typeof body.timezone === 'string' ? body.timezone.trim().slice(0, 80) : 'UTC';
  const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 2000) : '';

  if (name.length < 2) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  }

  const start = body.startIso ? new Date(body.startIso) : null;
  const end = body.endIso ? new Date(body.endIso) : null;
  if (!start || Number.isNaN(start.getTime()) || !end || Number.isNaN(end.getTime())) {
    return NextResponse.json({ error: 'Invalid start or end time.' }, { status: 400 });
  }
  if (end.getTime() <= start.getTime()) {
    return NextResponse.json({ error: 'End time must be after start time.' }, { status: 400 });
  }

  const roomSuffix = getDefaultScheduledRoomSuffix();
  const meetUrl = getScheduledMeetUrl(roomSuffix);
  const origin = getPublicSiteOrigin();

  const title = `Parable — Investor meeting (${name})`;
  const description = [
    `Investor video room (LiveKit): open this link at the meeting time, enter your name, and join.`,
    ``,
    `Join: ${meetUrl}`,
    ``,
    `Room: investor-${roomSuffix.replace(/^investor-/i, '')}`,
    `Timezone you chose: ${tz}`,
    notes ? `\nNotes:\n${notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const ics = buildIcsCalendar({
    title,
    description,
    locationUrl: meetUrl,
    startUtc: start,
    endUtc: end,
  });

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.5;color:#111">
      <h1 style="font-size:18px;">Your Parable meeting is saved</h1>
      <p>Hi ${escapeHtml(name)},</p>
      <p>Here are your details. A calendar file is attached—add it to Outlook, Google Calendar, or Apple Calendar.</p>
      <p><strong>When:</strong> ${escapeHtml(start.toISOString())} → ${escapeHtml(end.toISOString())} (UTC; your zone: ${escapeHtml(tz)})</p>
      <p><strong>Video room:</strong><br/><a href="${meetUrl}">${meetUrl}</a></p>
      <p style="font-size:13px;color:#444">Use the same room name we use for scheduled investor sessions. Enter your display name on the page before joining.</p>
      ${notes ? `<p><strong>Your notes:</strong><br/>${escapeHtml(notes)}</p>` : ''}
      <p style="font-size:12px;color:#666">— Parable</p>
    </div>
  `;

  let emailSent = false;
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (resendKey && from) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from,
        to: email,
        subject: 'Parable — Investor meeting & video link',
        html,
        attachments: [{ filename: 'parable-investor-meeting.ics', content: Buffer.from(ics, 'utf-8') }],
      });
      emailSent = true;
      try {
        await resend.emails.send({
          from,
          to: CONTACT,
          subject: `[Booking] ${name} — investor slot`,
          html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(start.toISOString())} – ${escapeHtml(end.toISOString())}</p>${notes ? `<p>${escapeHtml(notes)}</p>` : ''}<p><a href="${meetUrl}">Room</a></p>`,
        });
      } catch (e) {
        console.error('[meeting/schedule] team notify', e);
      }
    } catch (e) {
      console.error('[meeting/schedule] Resend', e);
    }
  }

  return NextResponse.json({
    ok: true,
    emailSent,
    meetUrl,
    roomLabel: `investor-${roomSuffix.replace(/^investor-/i, '')}`,
    siteOrigin: origin,
    icsBase64: Buffer.from(ics, 'utf-8').toString('base64'),
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
