import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { INVESTOR_AGREEMENT_VERSION } from '@/lib/investor-agreement-text';

const PAGE = { w: 612, h: 792 } as const;
const M = 50;
const LH = 11;
const FS = 9;
const MAX_LINE = 90;

/**
 * Map typographic marks to ASCII so StandardFonts.Helvetica (WinAnsi) never throws on encode.
 */
export function toPdfBodyChars(s: string): string {
  return s
    .replace(/[\u2018\u2019\u00B4]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, '-')
    .replace(/[\u00A0\u202F]/g, ' ')
    .split('')
    .map((c) => {
      const n = c.codePointAt(0)!;
      if (n >= 0x20 && n < 0x7f) return c;
      return ' ';
    })
    .join('');
}

function wrapToLines(input: string, max: number): string[] {
  const out: string[] = [];
  for (const par of input.split('\n')) {
    if (par.length === 0) {
      out.push('');
      continue;
    }
    const words = par.split(/\s+/);
    let cur = '';
    for (const w of words) {
      if (!w) continue;
      if (w.length > max) {
        if (cur) {
          out.push(cur);
          cur = '';
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

/**
 * Renders a PDF copy of the stored NDA text plus signature metadata (one file for email attachments).
 */
export async function buildNdaSignaturePdfBuffer(input: {
  documentSnapshot: string;
  printedName: string;
  email: string;
  signature: string;
  signedAtUtc: string;
  clientIp: string | null;
}): Promise<Buffer> {
  const { documentSnapshot, printedName, email, signature, signedAtUtc, clientIp } = input;
  const doc = await PDFDocument.create();
  const bodyFont = await doc.embedFont(StandardFonts.Helvetica);
  const titleFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const body = toPdfBodyChars(documentSnapshot);
  const signText = [
    '--- Electronic signature ---',
    `Printed name: ${toPdfBodyChars(printedName)}`,
    `Email: ${toPdfBodyChars(email)}`,
    `Signature (typed): ${toPdfBodyChars(signature)}`,
    `Agreement version: ${INVESTOR_AGREEMENT_VERSION}`,
    `Signed (recorded UTC): ${toPdfBodyChars(signedAtUtc)}`,
    clientIp ? `Request IP: ${toPdfBodyChars(clientIp)}` : '',
  ]
    .filter((x) => x.length > 0)
    .join('\n');
  const signWrapped = wrapToLines(signText, MAX_LINE);
  const bodyLines = wrapToLines(body, MAX_LINE);

  const title = 'Parable - NDA / electronic acknowledgment (copy for your records)';
  const all: { text: string; size: number; bold: boolean; gap: number }[] = [
    { text: title, size: 10, bold: true, gap: 16 },
  ];
  for (const t of bodyLines) all.push({ text: t, size: FS, bold: false, gap: LH });
  all.push({ text: '', size: FS, bold: false, gap: 8 });
  for (const t of signWrapped) all.push({ text: t, size: FS, bold: false, gap: LH });

  let page = doc.addPage([PAGE.w, PAGE.h]);
  let baselineY = PAGE.h - M;

  for (const row of all) {
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

  const u8 = await doc.save();
  return Buffer.from(u8);
}
