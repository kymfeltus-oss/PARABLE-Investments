/**
 * Shared NDA / e-sign validation (client + API). Keep rules in sync.
 */

const MAX_NAME = 200;
const MAX_EMAIL = 320;

/** Stricter than a single loose regex: no spaces, plausible domain + TLD. */
export function isValidInvestorEmail(raw: string): boolean {
  const email = raw.trim().toLowerCase();
  if (email.length < 5 || email.length > MAX_EMAIL) return false;
  if (email.includes(' ') || email.includes('..')) return false;
  const at = email.indexOf('@');
  if (at <= 0 || at !== email.lastIndexOf('@')) return false;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (!local.length || !domain.length) return false;
  if (domain.startsWith('.') || domain.endsWith('.') || !domain.includes('.')) return false;
  const tld = domain.split('.').pop() ?? '';
  if (tld.length < 2 || tld.length > 63 || !/^[a-z0-9-]+$/i.test(tld)) return false;
  // Local part: allow common unquoted atoms
  if (!/^[a-z0-9._%+-]+$/i.test(local) || local.startsWith('.') || local.endsWith('.')) return false;
  if (!/^[a-z0-9.-]+$/i.test(domain)) return false;
  return true;
}

/** Collapse whitespace, lowercase, strip common punctuation so "Jane Q. Investor" matches "jane q investor". */
export function normalizeNameForSignatureMatch(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,]/g, '')
    .trim();
}

export function printedNameMatchesSignature(printedName: string, signature: string): boolean {
  const a = normalizeNameForSignatureMatch(printedName);
  const b = normalizeNameForSignatureMatch(signature);
  if (a.length < 2 || b.length < 2) return false;
  return a === b;
}

/** Expect at least two name parts (typical legal name) or one longer token (single legal name). */
export function validatePrintedNameFormat(name: string): string | null {
  const t = name.trim();
  if (t.length < 3) {
    return 'Enter your full legal name (at least 3 characters).';
  }
  if (t.length > MAX_NAME) {
    return 'Name is too long.';
  }
  if (!/^[\p{L}\p{M}\s'.-]+$/u.test(t)) {
    return 'Use letters for your name (hyphens and apostrophes allowed).';
  }
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const short = parts.filter((p) => p.replace(/[.'-]/g, '').length < 1);
    if (short.length) return 'Each part of your name should include at least one letter.';
    return null;
  }
  if (parts.length === 1 && parts[0].length >= 4) {
    return null;
  }
  return 'Enter first and last name (e.g. Jane Investor), unless you use a single legal name.';
}

export function validateSignatureFormat(signature: string): string | null {
  const t = signature.trim();
  if (t.length < 3) {
    return 'Type your full legal name as your signature (at least 3 characters).';
  }
  if (t.length > MAX_NAME) {
    return 'Signature is too long.';
  }
  if (!/^[\p{L}\p{M}\s'.-]+$/u.test(t)) {
    return 'Use letters in your signature (same characters as your printed name).';
  }
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const short = parts.filter((p) => p.replace(/[.'-]/g, '').length < 1);
    if (short.length) return 'Each part of your signature should include at least one letter.';
    return null;
  }
  if (parts.length === 1 && parts[0].length >= 4) {
    return null;
  }
  return 'Signature should match your printed name format (first and last, or one legal name).';
}

export type NdaFieldErrors = {
  printedName?: string;
  signature?: string;
  email?: string;
};

export function validateNdaFields(printedName: string, signature: string, email: string): NdaFieldErrors {
  const errors: NdaFieldErrors = {};

  const nameErr = validatePrintedNameFormat(printedName);
  if (nameErr) errors.printedName = nameErr;

  const sigErr = validateSignatureFormat(signature);
  if (sigErr) errors.signature = sigErr;

  if (!isValidInvestorEmail(email)) {
    errors.email = 'Enter a valid email address (example: you@company.com).';
  }

  if (!nameErr && !sigErr && !errors.email && !printedNameMatchesSignature(printedName, signature)) {
    errors.signature = 'Electronic signature must match your printed legal name exactly.';
  }

  return errors;
}

export function ndaFieldsAreValid(printedName: string, signature: string, email: string): boolean {
  const e = validateNdaFields(printedName, signature, email);
  return Object.keys(e).length === 0;
}
