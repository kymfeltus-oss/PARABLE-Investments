import { Resend } from 'resend';
import { INVESTOR_AGREEMENT_VERSION } from '@/lib/investor-agreement-text';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';
import { buildNdaSignaturePdfBuffer } from '@/lib/nda-pdf';

const CONTACT = process.env.NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL?.trim() || 'investors@parableinvestments.com';
/** Second inbox for an NDA PDF copy (overridable via env). */
const NDA_STAFF = process.env.NDA_STAFF_EMAIL?.trim() || 'kymfeltus@gmail.com';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

function resolveResendFrom(): string | null {
  const fromEnv = process.env.RESEND_FROM_EMAIL ? sanitizeResendFromHeader(process.env.RESEND_FROM_EMAIL) : '';
  const fromContact = sanitizeResendFromHeader(CONTACT);
  const fromPrimary = toResendApiFrom(fromEnv);
  const fromFallback = toResendApiFrom(fromContact);
  if (fromPrimary) return fromPrimary;
  if (fromFallback) {
    if (fromEnv) {
      console.warn(
        '[send-nda-signature-pdfs] RESEND_FROM_EMAIL is not a valid sender; using investor contact address as from.',
      );
    }
    return fromFallback;
  }
  return null;
}

export type NdaPdfEmailStatus = 'sent' | 'unconfigured' | 'failed';

export type SendNdaPdfResult = { status: NdaPdfEmailStatus; errorMessage: string | null };

/**
 * E-mails a PDF of the NDA to the signatory and a copy to Parable inboxes, using the same
 * `RESEND_API_KEY` / `RESEND_FROM_EMAIL` setup as meeting confirmations.
 */
export async function sendNdaSignaturePdfCopies(input: {
  documentSnapshot: string;
  printedName: string;
  email: string;
  signature: string;
  signedAtUtc: string;
  clientIp: string | null;
}): Promise<SendNdaPdfResult> {
  const { documentSnapshot, printedName, email, signature, signedAtUtc, clientIp } = input;
  const resendKey = process.env.RESEND_API_KEY;
  const from = resolveResendFrom();
  if (!resendKey || !from) {
    console.warn(
      '[send-nda-signature-pdfs] NDA saved but no PDF e-mail: set RESEND_API_KEY and a valid from (see meeting/register).',
    );
    return { status: 'unconfigured', errorMessage: null };
  }

  const pdf = await buildNdaSignaturePdfBuffer({
    documentSnapshot,
    printedName,
    email,
    signature,
    signedAtUtc,
    clientIp,
  });
  const b64 = pdf.toString('base64');
  const filename = `Parable-NDA-${INVESTOR_AGREEMENT_VERSION}.pdf`.replace(/[^\w.+-]+/g, '-');

  const resend = new Resend(resendKey);
  const att = { filename, content: b64, contentType: 'application/pdf' as const };

  const signPlain = `This message includes a PDF copy of your Parable investor NDA (electronic acknowledgment) as recorded. Version: ${INVESTOR_AGREEMENT_VERSION}. If you did not sign this, contact ${CONTACT}.\n`;
  const signHtml = `<p>This message includes a <strong>PDF</strong> copy of your Parable investor NDA (electronic acknowledgment) as recorded.</p><p style="color:#666;font-size:13px">Version: <code>${escapeHtml(INVESTOR_AGREEMENT_VERSION)}</code></p><p style="color:#666;font-size:12px">If you did not sign this, contact <a href="mailto:${escapeHtml(CONTACT)}">${escapeHtml(CONTACT)}</a>.</p>`;

  const r1 = await resend.emails.send({
    from,
    to: email,
    subject: 'Your Parable NDA / acknowledgment (PDF copy)',
    text: signPlain,
    html: signHtml,
    attachments: [att],
  });
  if (r1.error) {
    const msg = pickResendError(r1.error);
    console.error('[send-nda-signature-pdfs] Signer PDF e-mail rejected:', r1.error);
    return { status: 'failed', errorMessage: msg };
  }

  const internalList: string[] = [];
  for (const x of [CONTACT, NDA_STAFF]) {
    const t = x.trim();
    if (!t) continue;
    if (internalList.some((e) => e.toLowerCase() === t.toLowerCase())) continue;
    internalList.push(t);
  }

  const r2 = await resend.emails.send({
    from,
    to: internalList,
    subject: `[NDA signed] ${printedName} <${email}>`,
    text: `Attached: PDF of the NDA on file. Signer: ${printedName} <${email}>. Version: ${INVESTOR_AGREEMENT_VERSION}. Time (UTC): ${signedAtUtc}. IP: ${clientIp ?? 'n/a'}.`,
    html: `<p>Attached: PDF of the NDA on file.</p>
<p><strong>${escapeHtml(printedName)}</strong> &lt;${escapeHtml(email)}&gt;</p>
<p>Version: <code>${escapeHtml(INVESTOR_AGREEMENT_VERSION)}</code><br/>Recorded (UTC): <code>${escapeHtml(signedAtUtc)}</code><br/>IP: ${escapeHtml(clientIp ?? 'n/a')}</p>`,
    attachments: [att],
  });
  if (r2.error) {
    const msg = pickResendError(r2.error);
    console.error('[send-nda-signature-pdfs] Internal NDA PDF e-mail rejected:', r2.error);
    return { status: 'failed', errorMessage: msg };
  }

  return { status: 'sent', errorMessage: null };
}
