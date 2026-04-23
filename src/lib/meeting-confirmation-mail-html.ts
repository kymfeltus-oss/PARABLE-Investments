/** Escape text for HTML body. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Escape for double-quoted HTML attributes. */
function escAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function firstName(full: string): string {
  const t = full.trim();
  if (!t) return 'there';
  return t.split(/\s+/)[0] ?? t;
}

/** One detail row: label (muted) + value — easier to scan than a monospace grid. */
function field(label: string, valueHtml: string): string {
  return `
<tr>
<td style="padding:0 0 18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<p style="margin:0;font-size:11px;line-height:1.4;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#8b919c;">${label}</p>
<p style="margin:6px 0 0;font-size:15px;line-height:1.45;color:#f1f3f7;font-weight:400;">${valueHtml}</p>
</td>
</tr>`;
}

export type MeetingConfirmationHtmlInput = {
  name: string;
  meetUrl: string;
  roomLabel: string;
  suffixOnly: string;
  regId: string | null;
  schedulingUrl: string;
  meetingHostKey: string;
  ndaVersion: string;
  googleCalendarUrl: string;
  icsFilename: string;
  reminderOffsetHours: number;
};

/**
 * Table-based, inline-styled HTML for investor meeting confirmation.
 * Prioritizes clarity and calm hierarchy over decorative “HUD” chrome.
 */
export function buildInvestorMeetingConfirmationHtml(p: MeetingConfirmationHtmlInput): string {
  const greet = esc(firstName(p.name));

  const schedulingBlock = p.schedulingUrl.trim()
    ? `
<tr><td style="padding:28px 32px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#8b919c;">Pick a time</p>
<p style="margin:0;font-size:15px;line-height:1.55;color:#d1d5dd;">
When you&apos;re ready, choose a slot on our calendar:<br/>
<a href="${escAttr(p.schedulingUrl)}" style="color:#38bdf8;text-decoration:underline;text-underline-offset:3px;">${esc(p.schedulingUrl)}</a>
</p>
</td></tr>`
    : '';

  const hostKeyBlock =
    p.meetingHostKey.length > 0
      ? `
<tr><td style="padding:24px 32px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:8px;border:1px solid #3f3428;background:#1a1612;">
<tr><td style="padding:16px 18px;">
<p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#d6a85c;">Parable team only</p>
<p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:#d4c9bc;">
If you join as <strong style="color:#f5e6d3;">Parable team</strong>, use this host key on the meeting page. Treat it like a password.
</p>
<p style="margin:0 0 8px;font-size:11px;color:#b49b82;">Host key</p>
<p style="margin:0;padding:12px 14px;background:#0f0d0b;border-radius:6px;font-family:ui-monospace,Consolas,monospace;font-size:13px;line-height:1.4;color:#fcd9a8;word-break:break-all;border:1px solid #2d241c;">${esc(p.meetingHostKey)}</p>
</td></tr></table>
</td></tr>`
      : '';

  const regField = p.regId
    ? field(
        'Registration ID',
        `<span style="font-family:ui-monospace,Consolas,monospace;font-size:14px;color:#e2e8f0;">${esc(p.regId)}</span><span style="display:block;margin-top:6px;font-size:12px;color:#8b919c;font-weight:400;">Include this if you email support.</span>`,
      )
    : '';

  const meetLinkHtml = `<a href="${escAttr(p.meetUrl)}" style="color:#38bdf8;text-decoration:underline;text-underline-offset:3px;word-break:break-all;">${esc(p.meetUrl)}</a>`;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>Parable — Meeting confirmation</title>
</head>
<body style="margin:0;padding:0;background:#0a0b0d;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#0a0b0d;opacity:0;">
Parable investor video room link and your registration details are below.
${'&nbsp;'.repeat(100)}
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0b0d;">
<tr>
<td align="center" style="padding:32px 16px 48px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
<tr>
<td style="border-radius:12px;background:#13151a;border:1px solid #252a33;overflow:hidden;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding:32px 32px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<p style="margin:0 0 10px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Parable · Investor meeting</p>
<h1 style="margin:0;font-size:24px;line-height:1.3;font-weight:600;letter-spacing:-0.02em;color:#f8fafc;">Hi ${greet}, you&apos;re registered</h1>
<p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#94a3b8;">
This email confirms your investor meeting registration and ties it to our confidentiality process. <strong style="color:#cbd5e1;">NDA / acknowledgment on file:</strong> ${esc(p.ndaVersion)}.
</p>
</td>
</tr>
<tr>
<td align="center" style="padding:28px 32px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="border-radius:8px;background:#0ea5e9;">
<a href="${escAttr(p.meetUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;text-decoration:none;color:#ffffff;">
Join Parable video room
</a>
</td>
</tr>
</table>
<p style="margin:18px 0 0;font-size:14px;line-height:1.55;color:#94a3b8;max-width:440px;">
At meeting time: open the button, choose <strong style="color:#e2e8f0;">Investor</strong>, and sign in with the <strong style="color:#e2e8f0;">same email</strong> you used when you registered.
</p>
</td>
</tr>
<tr>
<td style="padding:8px 32px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<p style="margin:0;font-size:12px;line-height:1.5;color:#64748b;">If your calendar shows another link (for example &quot;Cal Video&quot;), that comes from the calendar app. For the Parable call, use this link unless we told you otherwise:</p>
<p style="margin:10px 0 0;font-size:13px;line-height:1.5;color:#cbd5e1;word-break:break-all;">${meetLinkHtml}</p>
</td>
</tr>
<tr><td style="padding:28px 32px 0;"><div style="height:1px;background:#252a33;font-size:0;line-height:0;">&nbsp;</div></td></tr>
<tr>
<td style="padding:28px 32px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<p style="margin:0 0 18px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#8b919c;">Your details</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${regField}
${field('Room name (full)', `<span style="font-family:ui-monospace,Consolas,monospace;font-size:14px;color:#e2e8f0;">${esc(p.roomLabel)}</span>`)}
${field(
    'Short room code',
    `<span style="font-family:ui-monospace,Consolas,monospace;font-size:14px;color:#e2e8f0;">${esc(p.suffixOnly)}</span><span style="display:block;margin-top:6px;font-size:12px;color:#8b919c;font-weight:400;">The part after <span style="font-family:ui-monospace,Consolas,monospace;">investor-</span> in the room name.</span>`,
  )}
</table>
</td>
</tr>
<tr><td style="padding:8px 32px 0;"><div style="height:1px;background:#252a33;font-size:0;line-height:0;">&nbsp;</div></td></tr>
<tr>
<td style="padding:28px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#8b919c;">Calendar reminder</p>
<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#94a3b8;">
We attached <strong style="color:#e2e8f0;">${esc(p.icsFilename)}</strong> — a placeholder reminder (${p.reminderOffsetHours} hours from now). After you book, your real meeting time will come from your calendar.
</p>
<a href="${escAttr(p.googleCalendarUrl)}" style="font-size:14px;font-weight:600;color:#38bdf8;text-decoration:underline;text-underline-offset:3px;">Add to Google Calendar</a>
</td>
</tr>
${schedulingBlock}
${hostKeyBlock}
<tr>
<td style="padding:8px 32px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<p style="margin:0;font-size:12px;line-height:1.6;color:#64748b;">
Kept as a record with your investor NDA / acknowledgment. Not legal advice.<br/>
<span style="color:#475569;">— Parable</span>
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}
