import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { INVESTOR_AGREEMENT_VERSION } from '@/lib/investor-agreement-text';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';
import { getDefaultScheduledRoomSuffix, getScheduledMeetUrl } from '@/lib/meeting-links';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const CONTACT = process.env.NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL ?? 'investors@parableinvestments.com';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; acknowledged?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Expected JSON body' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 320) : '';

  if (name.length < 2) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!isValidInvestorEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!body.acknowledged) {
    return NextResponse.json(
      { error: 'Please confirm that this scheduling is under your Parable investor NDA obligations.' },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      {
        error:
          'Server storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY, and run supabase/schema-meeting-nda-evidence.sql.',
      },
      { status: 503 }
    );
  }

  const forwarded = req.headers.get('x-forwarded-for');
  const clientIp = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null;
  const userAgent = req.headers.get('user-agent')?.slice(0, 512) || null;

  const { error: insertError } = await admin.from('meeting_nda_evidence').insert({
    name,
    email,
    nda_version: INVESTOR_AGREEMENT_VERSION,
    acknowledged: true,
    client_ip: clientIp,
    user_agent: userAgent,
  });

  if (insertError) {
    console.error('[meeting/register]', insertError.message);
    return NextResponse.json({ error: 'Could not save your scheduling record. Try again.' }, { status: 500 });
  }

  const roomSuffix = getDefaultScheduledRoomSuffix();
  const meetUrl = getScheduledMeetUrl(roomSuffix);
  const roomLabel = `investor-${roomSuffix.replace(/^investor-/i, '')}`;

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.5;color:#111">
      <h1 style="font-size:18px;">Parable — Meeting confirmation &amp; video access</h1>
      <p>Hi ${escapeHtml(name)},</p>
      <p>This email confirms your <strong>investor meeting scheduling registration</strong> and serves as a record tied to our confidentiality process.</p>
      <p><strong>NDA / acknowledgment version on file:</strong> ${escapeHtml(INVESTOR_AGREEMENT_VERSION)}</p>
      <p>After you pick a time in the Parable booking calendar, your calendar provider may send a <em>separate</em> message with the specific date and time.</p>
      <p><strong>Video room (LiveKit) — use at the meeting time:</strong><br/>
      <a href="${meetUrl}">${meetUrl}</a></p>
      <p style="font-size:13px;color:#444"><strong>Room:</strong> ${escapeHtml(roomLabel)} — open the link, enter your display name, then join.</p>
      <p style="font-size:12px;color:#555">This scheduling request is retained as supplemental evidence alongside your investor NDA / electronic acknowledgment. Not legal advice.</p>
      <p style="font-size:12px;color:#666">— Parable</p>
    </div>
  `;

  /** `sent` = user confirmation delivered via Resend; `unconfigured` = missing env; `failed` = Resend threw. */
  type EmailStatus = 'sent' | 'unconfigured' | 'failed';
  let emailStatus: EmailStatus = 'unconfigured';
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (resendKey && from) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from,
        to: email,
        subject: 'Parable — Meeting confirmation, video link & NDA scheduling record',
        html,
      });
      emailStatus = 'sent';
      try {
        await resend.emails.send({
          from,
          to: CONTACT,
          subject: `[Meeting + NDA evidence] ${name}`,
          html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p><p>NDA version: ${escapeHtml(INVESTOR_AGREEMENT_VERSION)}</p><p><a href="${meetUrl}">Room</a></p>`,
        });
      } catch (e) {
        console.error('[meeting/register] team notify', e);
      }
    } catch (e) {
      emailStatus = 'failed';
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[meeting/register] Resend user confirmation failed:', msg, e);
    }
  } else {
    console.warn(
      '[meeting/register] No confirmation email: set RESEND_API_KEY and RESEND_FROM_EMAIL on the server (e.g. Vercel env).'
    );
  }

  return NextResponse.json({
    ok: true,
    emailStatus,
    /** @deprecated use emailStatus === 'sent' */
    emailSent: emailStatus === 'sent',
    meetUrl,
    roomLabel,
  });
}
