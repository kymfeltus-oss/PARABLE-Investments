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

function row(label: string, valueHtml: string): string {
  return `
<tr>
<td style="padding:10px 14px;border-bottom:1px solid #1a1d28;font-family:ui-monospace,'Cascadia Code',Consolas,monospace;font-size:12px;color:#8b93a7;vertical-align:top;width:38%;">${label}</td>
<td style="padding:10px 14px;border-bottom:1px solid #1a1d28;font-family:ui-monospace,'Cascadia Code',Consolas,monospace;font-size:12px;color:#e8ecf4;word-break:break-all;">${valueHtml}</td>
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
 * Table-based, mostly-inline HTML for investor meeting confirmation (email clients).
 */
export function buildInvestorMeetingConfirmationHtml(p: MeetingConfirmationHtmlInput): string {
  const greet = esc(firstName(p.name));
  const schedulingBlock = p.schedulingUrl.trim()
    ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;">
<tr><td style="padding:16px 18px;border-radius:10px;border:1px solid #1e3a4a;background:linear-gradient(135deg,#0d1520 0%,#0a1018 100%);">
<p style="margin:0 0 6px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#5ee7e7;">Schedule</p>
<p style="margin:0;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:#c5cdd8;">
<strong style="color:#f0f4f8;">Book a time</strong> — <a href="${escAttr(p.schedulingUrl)}" style="color:#00f2ff;text-decoration:none;border-bottom:1px solid rgba(0,242,255,0.35);">${esc(p.schedulingUrl)}</a>
</p>
</td></tr></table>`
    : '';

  const hostKeyBlock =
    p.meetingHostKey.length > 0
      ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 0;">
<tr><td style="padding:16px 18px;border-radius:10px;border:1px solid #3d2a1a;background:#120f0a;">
<p style="margin:0 0 8px;font-family:ui-monospace,Consolas,monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#f59e0b;">Parable team — host credentials</p>
<p style="margin:0 0 10px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#d4c4b0;">
<strong style="color:#fde68a;">Host / meeting ID</strong> (full room name)
</p>
<p style="margin:0 0 12px;padding:10px 12px;background:#050403;border:1px solid #2a2015;border-radius:6px;font-family:ui-monospace,Consolas,monospace;font-size:12px;color:#fcd34d;word-break:break-all;">${esc(p.roomLabel)}</p>
<p style="margin:0 0 6px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#d4c4b0;"><strong style="color:#fde68a;">Suffix</strong> (after <code style="background:#1c1410;padding:2px 6px;border-radius:4px;color:#fca5a5;">investor-</code>)</p>
<p style="margin:0 0 12px;padding:10px 12px;background:#050403;border:1px solid #2a2015;border-radius:6px;font-family:ui-monospace,Consolas,monospace;font-size:12px;color:#fcd34d;word-break:break-all;">${esc(p.suffixOnly)}</p>
<p style="margin:0 0 6px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#d4c4b0;"><strong style="color:#fde68a;">Host key</strong> (choose &quot;Parable team&quot; on the meeting page)</p>
<p style="margin:0 0 10px;padding:10px 12px;background:#050403;border:1px solid #2a2015;border-radius:6px;font-family:ui-monospace,Consolas,monospace;font-size:12px;color:#fcd34d;word-break:break-all;">${esc(p.meetingHostKey)}</p>
<p style="margin:0;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:10px;color:#a38b6f;">Treat the host key like a password. Do not forward outside Parable.</p>
</td></tr></table>`
      : '';

  const regRow = p.regId ? row('Registration ID', `<span style="color:#00f2ff;">${esc(p.regId)}</span>`) : '';

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>Parable — Meeting confirmation</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#050506;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#050506;opacity:0;">
Your Parable investor video room link and NDA scheduling record are inside. Open on a trusted device.
${'&nbsp;'.repeat(120)}
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#050506;">
<tr><td align="center" style="padding:28px 16px 40px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border-collapse:collapse;">
<tr><td bgcolor="#00c8d4" style="height:3px;background:linear-gradient(90deg,#00f2ff,#7c3aed,#00f2ff);border-radius:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:0;border:1px solid #1a1d28;border-top:none;border-radius:0 0 14px 14px;background:#0b0c10;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="padding:28px 28px 8px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
<p style="margin:0 0 6px;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#5ee7e7;">// confidential briefing</p>
<h1 style="margin:0;font-size:22px;line-height:1.25;font-weight:800;letter-spacing:-0.02em;color:#f4f7fb;">You&apos;re cleared, ${greet}.</h1>
<p style="margin:14px 0 0;font-size:14px;line-height:1.6;color:#9aa3b2;">
This transmission confirms your <strong style="color:#e8ecf4;">investor meeting registration</strong> and links you to the <strong style="color:#00f2ff;">Parable video room</strong>. It is retained with our confidentiality process (NDA / acknowledgment <strong style="color:#cbd5e1;">${esc(p.ndaVersion)}</strong>).
</p>
</td></tr>
<tr><td style="padding:8px 28px 24px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;" align="center">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
<tr><td align="center" style="border-radius:10px;background:#00f2ff;">
<a href="${escAttr(p.meetUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:16px 36px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:13px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;text-decoration:none;color:#050506;">
Enter video room
</a>
</td></tr></table>
<p style="margin:14px 0 0;font-size:11px;line-height:1.5;color:#6b7280;max-width:480px;">
At meeting time: open the link, choose <strong style="color:#9ca3af;">Investor</strong>, and use the <strong style="color:#9ca3af;">same email</strong> you used when booking.
</p>
<p style="margin:8px 0 0;font-size:11px;font-family:ui-monospace,Consolas,monospace;word-break:break-all;">
<a href="${escAttr(p.meetUrl)}" style="color:#00d4e6;text-decoration:none;border-bottom:1px solid rgba(0,242,255,0.25);">${esc(p.meetUrl)}</a>
</p>
</td></tr>
<tr><td style="padding:0 28px 8px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #1f2430;border-radius:10px;overflow:hidden;background:#07080c;">
<tr><td colspan="2" style="padding:12px 14px;background:#0f1118;border-bottom:1px solid #1a1d28;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#7dd3fc;">Technical readout</td></tr>
${regRow}
${row('Host / meeting ID', esc(p.roomLabel))}
${row('Room suffix', `<code style="color:#a5f3fc;">${esc(p.suffixOnly)}</code>`)}
${row('NDA version', esc(p.ndaVersion))}
</table>
</td></tr>
<tr><td style="padding:12px 28px 20px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.65;color:#8b93a7;">
If your calendar app shows a different link (e.g. <strong style="color:#a1a8b8;">Cal Video</strong>), that comes from the calendar provider. For the <strong style="color:#e8ecf4;">Parable</strong> investor call, use the <strong style="color:#00f2ff;">video room</strong> above unless we told you otherwise.
</td></tr>
<tr><td style="padding:0 28px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:10px;border:1px solid #14532d;background:#071910;">
<tr><td style="padding:16px 18px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
<p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#4ade80;">Calendar</p>
<p style="margin:0 0 10px;font-size:13px;line-height:1.55;color:#bbf7d0;">
Placeholder reminder attached: <code style="background:#052e16;padding:2px 6px;border-radius:4px;color:#86efac;">${esc(p.icsFilename)}</code> (${p.reminderOffsetHours}h from send). Your real slot arrives from your booking provider.
</p>
<a href="${escAttr(p.googleCalendarUrl)}" style="display:inline-block;font-size:13px;font-weight:700;color:#4ade80;text-decoration:none;border-bottom:1px solid rgba(74,222,128,0.4);">Add to Google Calendar →</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:0 28px 28px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
${schedulingBlock}
${hostKeyBlock}
<p style="margin:24px 0 0;font-size:11px;line-height:1.6;color:#5c6370;">
Supplemental evidence alongside your investor NDA / electronic acknowledgment. Not legal advice.<br/>
<span style="color:#4b5563;">— Parable</span>
</p>
</td></tr>
</table>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
