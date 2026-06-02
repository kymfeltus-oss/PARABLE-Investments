import { Resend } from "resend";
import {
  buildPitchAccessAgreementPdfBuffer,
  type PitchAccessPdfAuditInput,
} from "@/lib/pitch-access-agreement-pdf";
import {
  isResendConfigured,
  resolvePresenterAlertEmail,
  resolveResendFromAddress,
} from "@/lib/resend/config";

export type PitchAccessEmailStatus = "sent" | "unconfigured" | "failed";

export type SendPitchAccessAgreementResult = {
  emailStatus: PitchAccessEmailStatus;
  errorMessage: string | null;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(input: {
  recipientLabel: string;
  investorName: string;
  investorEmail: string;
  signedAtUtc: string;
  agreementVersion: string;
  pitchTitle?: string | null;
  companyName?: string | null;
  productName?: string | null;
  governingState?: string | null;
  documentHash?: string;
}): string {
  const pitchLine = input.pitchTitle
    ? `<p><strong>Pitch room:</strong> ${escapeHtml(input.pitchTitle)}</p>`
    : "";
  const companyLine = input.companyName
    ? `<p><strong>Company:</strong> ${escapeHtml(input.companyName)}</p>`
    : "";
  const productLine = input.productName
    ? `<p><strong>Product:</strong> ${escapeHtml(input.productName)}</p>`
    : "";
  const stateLine = input.governingState
    ? `<p><strong>Governing state:</strong> ${escapeHtml(input.governingState)}</p>`
    : "";
  const hashLine = input.documentHash
    ? `<p><strong>Document hash:</strong> <code>${escapeHtml(input.documentHash.slice(0, 16))}…</code></p>`
    : "";

  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; color: #111;">
      <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Pitch Lock</p>
      <h1 style="font-size: 20px; margin: 0 0 16px;">Pitch Access Agreement signed</h1>
      <p>Hello ${escapeHtml(input.recipientLabel)},</p>
      <p>Your signed Pitch Access Agreement is attached as a PDF with a tamper-evident audit trail page.</p>
      ${pitchLine}
      ${companyLine}
      ${productLine}
      ${stateLine}
      <p><strong>Investor:</strong> ${escapeHtml(input.investorName)} (${escapeHtml(input.investorEmail)})</p>
      <p><strong>Signed date:</strong> ${escapeHtml(input.signedAtUtc)} UTC</p>
      <p><strong>Agreement version:</strong> ${escapeHtml(input.agreementVersion)}</p>
      ${hashLine}
    </div>
  `.trim();
}

function uniqueRecipients(emails: (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of emails) {
    const e = raw?.trim().toLowerCase();
    if (!e?.includes("@") || seen.has(e)) continue;
    seen.add(e);
    out.push(e);
  }
  return out;
}

/**
 * Sends signed PDF built from the exact saved document_snapshot plus audit certificate.
 * Does not throw when Resend is unconfigured — returns emailStatus: 'unconfigured'.
 */
export async function sendPitchAccessAgreementEmails(input: {
  documentSnapshot: string;
  investorName: string;
  investorEmail: string;
  signature: string;
  clientIp: string | null;
  userAgent: string | null;
  presenterEmail: string | null;
  presenterName?: string | null;
  signedAtUtc: string;
  agreementVersion: string;
  pitchTitle?: string | null;
  companyName?: string | null;
  productName?: string | null;
  governingState?: string | null;
  audit: PitchAccessPdfAuditInput;
}): Promise<SendPitchAccessAgreementResult> {
  if (!isResendConfigured()) {
    return { emailStatus: "unconfigured", errorMessage: null };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { emailStatus: "unconfigured", errorMessage: null };
  }

  const from = resolveResendFromAddress();
  const resend = new Resend(apiKey);
  const subject = "Pitch Lock — Your signed Pitch Access Agreement";

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await buildPitchAccessAgreementPdfBuffer({
      documentSnapshot: input.documentSnapshot,
      investorName: input.investorName,
      investorEmail: input.investorEmail,
      signature: input.signature,
      signedAtUtc: input.signedAtUtc,
      clientIp: input.clientIp,
      userAgent: input.userAgent,
      audit: input.audit,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { emailStatus: "failed", errorMessage: `PDF generation failed: ${msg}` };
  }

  const attachment = {
    filename: "pitch-access-agreement.pdf",
    content: pdfBuffer.toString("base64"),
  };

  const htmlBase = {
    investorName: input.investorName,
    investorEmail: input.investorEmail,
    signedAtUtc: input.signedAtUtc,
    agreementVersion: input.agreementVersion,
    pitchTitle: input.pitchTitle,
    companyName: input.companyName,
    productName: input.productName,
    governingState: input.governingState,
    documentHash: input.audit.documentHash,
  };

  const recipients = uniqueRecipients([
    input.investorEmail,
    input.presenterEmail,
    resolvePresenterAlertEmail(),
  ]);

  if (recipients.length === 0) {
    return { emailStatus: "unconfigured", errorMessage: null };
  }

  try {
    for (const to of recipients) {
      const label =
        to === input.investorEmail.toLowerCase()
          ? input.investorName
          : to === input.presenterEmail?.toLowerCase()
            ? "Presenter"
            : "Owner";

      const result = await resend.emails.send({
        from,
        to,
        subject:
          to === input.investorEmail.toLowerCase()
            ? subject
            : `Pitch Lock — Investor signed: ${input.investorName}`,
        html: buildEmailHtml({ recipientLabel: label, ...htmlBase }),
        attachments: [attachment],
      });

      if (result.error) {
        return {
          emailStatus: "failed",
          errorMessage: result.error.message ?? `Failed to email ${to}`,
        };
      }
    }

    return { emailStatus: "sent", errorMessage: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      emailStatus: "failed",
      errorMessage: msg.length > 400 ? `${msg.slice(0, 400)}…` : msg,
    };
  }
}
