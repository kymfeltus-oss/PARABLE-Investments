import { randomUUID } from 'crypto';
import { Resend } from 'resend';
import { INVESTOR_AGREEMENT_VERSION } from '@/lib/investor-agreement-text';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';
import { buildMeetingConfirmationCalendar } from '@/lib/meeting-calendar';
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

export type MeetingConfirmationMailResult = {
  emailStatus: 'sent' | 'unconfigured' | 'failed';
  resendConfirmationId: string | null;
  resendErrorMessage: string | null;
};

/**
 * Resend: investor confirmation + .ics, plus team notify. Used after registration (immediate or deferred).
 */
export async function sendParableInvestorMeetingConfirmation(params: {
  name: string;
  email: string;
  roomSuffix: string;
  /** From `meeting_nda_evidence.id` — for support and matching your booking record. */
  registrationId?: string | null;
  logLabel?: string;
}): Promise<MeetingConfirmationMailResult> {
  const { name, email, roomSuffix, registrationId, logLabel = '[meeting/mail]' } = params;
  const regId =
    typeof registrationId === 'string' && /^[0-9a-f-]{36}$/i.test(registrationId.trim()) ? registrationId.trim() : null;
  const suffixOnly = roomSuffix.replace(/^investor-/i, '');
  const meetUrl = getScheduledMeetUrl(suffixOnly);
  const roomLabel = `investor-${suffixOnly}`;

  const schedulingUrl = process.env.NEXT_PUBLIC_SCHEDULING_URL?.trim() ?? '';
  const meetingHostKey = process.env.MEETING_MASTER_KEY?.trim() ?? '';

  const offsetHours = Number(process.env.MEETING_CONFIRMATION_CALENDAR_OFFSET_HOURS);
  const reminderOffsetHours = Number.isFinite(offsetHours) && offsetHours > 0 ? offsetHours : 24;
  const durationMin = Number(process.env.MEETING_CONFIRMATION_CALENDAR_DURATION_MINUTES);
  const durationMinutes = Number.isFinite(durationMin) && durationMin > 0 ? durationMin : 60;

  const icsFilename = `${roomLabel.replace(/[^a-zA-Z0-9_-]/g, '-')}-parable-meeting.ics`;

  const hostKeySection =
    meetingHostKey.length > 0
      ? `
      <p style="margin-top:1.25rem;padding:0.75rem 1rem;background:#f6f8fa;border:1px solid #e1e4e8;border-radius:8px;font-size:13px;color:#222">
        <strong>Parable team — scheduled video call</strong><br/>
        <span style="color:#444"><strong>Host / meeting ID</strong> (full room name):</span>
        <code style="display:block;margin:0.35rem 0;font-size:13px;word-break:break-all;background:#fff;padding:0.5rem;border-radius:4px;border:1px solid #ddd">${escapeHtml(roomLabel)}</code>
        <span style="color:#444">Suffix (after <code style="background:#eee;padding:0 4px;border-radius:4px">investor-</code>):</span>
        <code style="display:block;margin:0.35rem 0;font-size:13px;word-break:break-all;background:#fff;padding:0.5rem;border-radius:4px;border:1px solid #ddd">${escapeHtml(suffixOnly)}</code>
        <span style="color:#444">Host key (choose &quot;Parable team&quot; on the meeting page):</span>
        <code style="display:block;margin:0.35rem 0;font-size:13px;word-break:break-all;background:#fff;padding:0.5rem;border-radius:4px;border:1px solid #ddd">${escapeHtml(meetingHostKey)}</code>
        <span style="font-size:11px;color:#666">Treat the host key like a password. Do not forward to people outside Parable.</span>
      </p>`
      : '';

  const plainDetailLines: string[] = [
    `Hi ${name},`,
    '',
    'Parable — meeting confirmation & video access',
    `NDA / acknowledgment version: ${INVESTOR_AGREEMENT_VERSION}`,
    '',
    'Meeting details',
    ...(regId ? [`— Parable registration ID (include in support email): ${regId}`] : []),
    `— Host / meeting ID (full): ${roomLabel}`,
    `— Room suffix (after "investor-"): ${suffixOnly}`,
    `— Parable video room (for the Parable investor call): ${meetUrl}`,
    '',
    'If your calendar (e.g. Cal.com) shows a different "meeting" or "video" link, that comes from the calendar product. For the Parable investor call, use the "Parable video room" line above unless we told you otherwise.',
  ];
  if (schedulingUrl) {
    plainDetailLines.push(`— Book a time (scheduling): ${schedulingUrl}`);
  }
  if (meetingHostKey) {
    plainDetailLines.push(
      '',
      'Parable team (host path):',
      `— Host key (choose "Parable team" on the meeting page): ${meetingHostKey}`,
      '(Keep this secret — do not forward outside Parable.)',
    );
  }
  plainDetailLines.push(
    '',
    'Investors: open the join link at meeting time, choose Investor, and enter the same email you used when booking.',
    '',
    `Calendar: attached "${icsFilename}" is a placeholder reminder (${reminderOffsetHours}h from send). Your real meeting time will come from your calendar after you book.`,
    '',
    'This message is retained as supplemental evidence alongside your investor NDA. Not legal advice.',
    '— Parable',
  );
  const plainBody = plainDetailLines.join('\n');

  const icsDescriptionLines = [
    'Parable investor meeting — details',
    '',
    `NDA version on file: ${INVESTOR_AGREEMENT_VERSION}`,
    '',
    ...(regId ? [`Parable registration ID: ${regId}`] : []),
    `Host / meeting ID (full): ${roomLabel}`,
    `Room suffix: ${suffixOnly}`,
    `Parable video room: ${meetUrl}`,
    ...(schedulingUrl ? [`Book time: ${schedulingUrl}`] : []),
    ...(meetingHostKey
      ? ['', 'Parable team — host key (do not share outside Parable):', meetingHostKey]
      : []),
    '',
    `Placeholder calendar block (${reminderOffsetHours}h reminder). After you book, use your real calendar invite for the meeting time.`,
  ];

  const calendar = buildMeetingConfirmationCalendar({
    uidSuffix: randomUUID(),
    summary: `Parable — investor meeting (${roomLabel})`,
    descriptionLines: icsDescriptionLines,
    locationUrl: meetUrl,
    reminderOffsetHours,
    durationMinutes,
  });

  const calendarSection = `
      <p style="margin-top:1.25rem;padding:0.75rem 1rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:13px;color:#14532d">
        <strong>Save to your calendar</strong><br/>
        <span style="color:#166534">A placeholder reminder is attached (<code style="background:#dcfce7;padding:0 4px;border-radius:4px">.ics</code>). After you book, your real meeting time will come from your calendar provider.</span><br/>
        <a href="${escapeHtmlAttr(calendar.googleCalendarUrl)}" style="display:inline-block;margin-top:0.5rem;color:#15803d;font-weight:600">Add to Google Calendar</a>
      </p>`;

  const schedulingBlock = schedulingUrl
    ? `<p><strong>Book a time:</strong><br/><a href="${escapeHtmlAttr(schedulingUrl)}">${escapeHtml(schedulingUrl)}</a></p>`
    : '';

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.5;color:#111">
      <h1 style="font-size:18px;">Parable — Meeting confirmation &amp; video access</h1>
      <p>Hi ${escapeHtml(name)},</p>
      <p>This email confirms your <strong>investor meeting scheduling registration</strong> and serves as a record tied to our confidentiality process.</p>
      <p><strong>NDA / acknowledgment version on file:</strong> ${escapeHtml(INVESTOR_AGREEMENT_VERSION)}</p>
      <p>After you pick a time in the Parable booking calendar, your calendar provider may send a <em>separate</em> message with the specific date, time, and (sometimes) its own video or meeting link.</p>
      <p style="font-size:13px;color:#444">If you see a link such as <strong>Cal Video</strong> in that calendar message, that comes from the calendar, not this email. For the <strong>Parable</strong> investor call, use the <strong>Parable video room</strong> link below, unless the team told you to use a different method.</p>
      <p style="padding:0.75rem 1rem;background:#fafafa;border:1px solid #eee;border-radius:8px;font-size:14px">
        <strong>Parable — meeting &amp; room IDs</strong><br/>
        ${
          regId
            ? `<span style="color:#444"><strong>Parable registration ID</strong> (include if you contact support):</span>
        <code style="display:block;margin:0.35rem 0;font-size:13px;word-break:break-all;background:#fff;padding:0.5rem;border-radius:4px;border:1px solid #ddd">${escapeHtml(regId)}</code>`
            : ''
        }
        <span style="color:#444"><strong>Host / meeting ID:</strong></span>
        <code style="display:block;margin:0.35rem 0;font-size:13px;word-break:break-all;background:#fff;padding:0.5rem;border-radius:4px;border:1px solid #ddd">${escapeHtml(roomLabel)}</code>
        <span style="color:#444"><strong>Room suffix</strong> (after <code style="background:#eee;padding:0 4px;border-radius:4px">investor-</code>):</span>
        <code style="display:block;margin:0.35rem 0;font-size:13px;word-break:break-all;background:#fff;padding:0.5rem;border-radius:4px;border:1px solid #ddd">${escapeHtml(suffixOnly)}</code>
      </p>
      ${schedulingBlock}
      <p><strong>Investors — join the call</strong><br/>
      Open the link below at meeting time. On the next page, choose <strong>Investor</strong> and enter the <strong>same email</strong> you used when booking.</p>
      <p><strong>Parable video room:</strong><br/>
      <a href="${escapeHtmlAttr(meetUrl)}">${escapeHtml(meetUrl)}</a></p>
      ${hostKeySection}
      ${calendarSection}
      <p style="font-size:12px;color:#555">This scheduling request is retained as supplemental evidence alongside your investor NDA / electronic acknowledgment. Not legal advice.</p>
      <p style="font-size:12px;color:#666">— Parable</p>
    </div>
  `;

  let emailStatus: MeetingConfirmationMailResult['emailStatus'] = 'unconfigured';
  const resendKey = process.env.RESEND_API_KEY;
  const fromEnv = process.env.RESEND_FROM_EMAIL
    ? sanitizeResendFromHeader(process.env.RESEND_FROM_EMAIL)
    : '';
  const fromContact = sanitizeResendFromHeader(CONTACT);
  const fromPrimary = toResendApiFrom(fromEnv);
  const fromFallback = toResendApiFrom(fromContact);
  let from: string | undefined;
  if (fromPrimary) {
    from = fromPrimary;
  } else if (fromFallback) {
    if (fromEnv) {
      console.warn(
        `${logLabel} RESEND_FROM_EMAIL is not a valid sender; using investor contact address as from.`,
      );
    }
    from = fromFallback;
  } else {
    from = undefined;
  }

  let resendConfirmationId: string | null = null;
  let resendErrorMessage: string | null = null;

  if (resendKey && from) {
    try {
      const resend = new Resend(resendKey);
      const icsBase64 = Buffer.from(calendar.ics, 'utf8').toString('base64');
      const userResult = await resend.emails.send({
        from,
        to: email,
        subject: 'Parable — Meeting confirmation, video link & NDA scheduling record',
        text: plainBody,
        html,
        attachments: [
          {
            filename: icsFilename,
            content: icsBase64,
            contentType: 'text/calendar; charset=utf-8',
          },
        ],
      });
      if (userResult.error) {
        emailStatus = 'failed';
        resendErrorMessage = pickResendError(userResult.error);
        console.error(
          `${logLabel} Resend user confirmation rejected:`,
          userResult.error.message ?? userResult.error,
        );
      } else {
        emailStatus = 'sent';
        resendConfirmationId = userResult.data?.id ?? null;
        const teamResult = await resend.emails.send({
          from,
          to: CONTACT,
          subject: `[Meeting + NDA evidence] ${name}`,
          html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>${
            regId ? `<p>Registration id: <code>${escapeHtml(regId)}</code></p>` : ''
          }<p>NDA version: ${escapeHtml(
            INVESTOR_AGREEMENT_VERSION,
          )}</p><p>Host / meeting ID: ${escapeHtml(roomLabel)}</p><p>Suffix: ${escapeHtml(suffixOnly)}</p><p><a href="${escapeHtmlAttr(
            meetUrl,
          )}">Parable join</a></p>${
            meetingHostKey ? `<p>Host key (internal): <code>${escapeHtml(meetingHostKey)}</code></p>` : ''
          }`,
        });
        if (teamResult.error) {
          console.error(`${logLabel} team notify rejected:`, teamResult.error.message ?? teamResult.error);
        }
      }
    } catch (e) {
      emailStatus = 'failed';
      const msg = e instanceof Error ? e.message : String(e);
      resendErrorMessage = msg.length > 600 ? `${msg.slice(0, 600)}…` : msg;
      console.error(`${logLabel} Resend user confirmation failed:`, msg, e);
    }
  } else {
    console.warn(
      `${logLabel} No confirmation email: set RESEND_API_KEY. Optional: RESEND_FROM_EMAIL (valid address on your Resend domain); if unset/invalid, the investor contact address is used as the sender when possible.`,
    );
  }

  return { emailStatus, resendConfirmationId, resendErrorMessage };
}
