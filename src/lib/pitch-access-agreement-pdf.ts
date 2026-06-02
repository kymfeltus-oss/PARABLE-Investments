import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { AgreementTemplateVars } from "@/lib/pitch-access-agreement";

const PAGE = { w: 612, h: 792 } as const;
const M = 50;
const LH = 11;
const FS = 9;
const MAX_LINE = 90;

function toPdfBodyChars(s: string): string {
  return s
    .replace(/[\u2018\u2019\u00B4]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/[\u00A0\u202F]/g, " ")
    .split("")
    .map((c) => {
      const n = c.codePointAt(0)!;
      if (n >= 0x20 && n < 0x7f) return c;
      return " ";
    })
    .join("");
}

function wrapToLines(input: string, max: number): string[] {
  const out: string[] = [];
  for (const par of input.split("\n")) {
    if (par.length === 0) {
      out.push("");
      continue;
    }
    const words = par.split(/\s+/);
    let cur = "";
    for (const w of words) {
      if (!w) continue;
      if (w.length > max) {
        if (cur) {
          out.push(cur);
          cur = "";
        }
        for (let i = 0; i < w.length; i += max) out.push(w.slice(i, i + max));
        continue;
      }
      const test = cur ? `${cur} ${w}` : w;
      if (test.length <= max) cur = test;
      else {
        if (cur) out.push(cur);
        cur = w;
      }
    }
    if (cur) out.push(cur);
  }
  return out;
}

type PdfRow = { text: string; size: number; bold: boolean; gap: number };

function rowsFromText(text: string, size = FS, gap = LH): PdfRow[] {
  return wrapToLines(toPdfBodyChars(text), MAX_LINE).map((t) => ({
    text: t,
    size,
    bold: false,
    gap,
  }));
}

function renderRows(
  doc: PDFDocument,
  bodyFont: Awaited<ReturnType<typeof PDFDocument.prototype.embedFont>>,
  titleFont: Awaited<ReturnType<typeof PDFDocument.prototype.embedFont>>,
  rows: PdfRow[]
): void {
  let page = doc.getPage(doc.getPageCount() - 1);
  let baselineY = page.getHeight() - M;

  for (const row of rows) {
    const font = row.bold ? titleFont : bodyFont;
    if (baselineY < M + row.gap) {
      page = doc.addPage([PAGE.w, PAGE.h]);
      baselineY = PAGE.h - M;
    }
    if (row.text.length > 0) {
      page.drawText(row.text, {
        x: M,
        y: baselineY,
        size: row.size,
        font,
        color: rgb(0, 0, 0),
      });
    }
    baselineY -= row.text.length > 0 ? row.gap : LH * 0.45;
  }
}

export type PitchAccessPdfAuditInput = {
  agreementId: string;
  documentHash: string;
  recordHash: string;
  agreementVersion: string;
  presenterName: string | null;
  presenterEmail: string | null;
  companyName: string | null;
  productName: string | null;
  signedAtUtc: string;
};

/**
 * Builds signed PDF from the exact saved document_snapshot (never regenerated legal text).
 * Appends a tamper-evident audit certificate page.
 */
export async function buildPitchAccessAgreementPdfBuffer(input: {
  documentSnapshot: string;
  investorName: string;
  investorEmail: string;
  signature: string;
  signedAtUtc: string;
  clientIp: string | null;
  userAgent: string | null;
  audit: PitchAccessPdfAuditInput;
}): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const bodyFont = await doc.embedFont(StandardFonts.Helvetica);
  const titleFont = await doc.embedFont(StandardFonts.HelveticaBold);

  doc.addPage([PAGE.w, PAGE.h]);

  const agreementRows: PdfRow[] = [
    { text: "Pitch Lock - Pitch Access Agreement (signed copy)", size: 10, bold: true, gap: 16 },
    ...rowsFromText(input.documentSnapshot),
  ];
  renderRows(doc, bodyFont, titleFont, agreementRows);

  const auditCertificate = [
    "DIGITAL SIGNATURE AUDIT TRAIL",
    "Document Status: SIGNED AND EXECUTED",
    `Document ID: ${input.audit.agreementId}`,
    `Document Hash: ${input.audit.documentHash}`,
    `Record Hash: ${input.audit.recordHash}`,
    "",
    "Presenter:",
    `Name: ${input.audit.presenterName ?? "—"}`,
    `Email: ${input.audit.presenterEmail ?? "—"}`,
    `Company: ${input.audit.companyName ?? "—"}`,
    `Product: ${input.audit.productName ?? "—"}`,
    "Action: Document Created and Secured through Pitch Lock",
    `Timestamp UTC: ${input.audit.signedAtUtc}`,
    "",
    "Recipient:",
    `Typed Signature: ${input.investorName}`,
    `Verified Email: ${input.investorEmail}`,
    `IP Address: ${input.clientIp ?? "—"}`,
    `Browser/Device: ${input.userAgent ?? "—"}`,
    "Action: Digitally Agreed to Pitch Access Terms",
    `Timestamp UTC: ${input.signedAtUtc}`,
    "",
    "This document was electronically executed using secure click-wrap tracking protocols through Pitch Lock.",
    "This audit trail is designed to support attribution, intent, and record retention.",
  ].join("\n");

  doc.addPage([PAGE.w, PAGE.h]);
  const auditRows: PdfRow[] = [
    { text: "AUDIT CERTIFICATE", size: 11, bold: true, gap: 18 },
    ...rowsFromText(auditCertificate),
  ];
  renderRows(doc, bodyFont, titleFont, auditRows);

  return Buffer.from(await doc.save());
}

/** @deprecated Use buildAgreementDocumentSnapshot vars at call site */
export type { AgreementTemplateVars };
