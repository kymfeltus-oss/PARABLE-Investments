/**
 * Shared Pitch Access Agreement validation (client + API).
 */

const MAX_NAME = 200;
const MAX_EMAIL = 320;

export type PitchAccessFieldErrors = {
  investorName?: string;
  investorEmail?: string;
  signature?: string;
  agreed?: string;
};

export function isValidInvestorEmail(raw: string): boolean {
  const email = raw.trim().toLowerCase();
  if (email.length < 5 || email.length > MAX_EMAIL) return false;
  if (email.includes(" ") || email.includes("..")) return false;
  const at = email.indexOf("@");
  if (at <= 0 || at !== email.lastIndexOf("@")) return false;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (!local.length || !domain.length) return false;
  if (domain.startsWith(".") || domain.endsWith(".") || !domain.includes(".")) return false;
  const tld = domain.split(".").pop() ?? "";
  if (tld.length < 2 || tld.length > 63 || !/^[a-z0-9-]+$/i.test(tld)) return false;
  if (!/^[a-z0-9._%+-]+$/i.test(local) || local.startsWith(".") || local.endsWith(".")) return false;
  if (!/^[a-z0-9.-]+$/i.test(domain)) return false;
  return true;
}

function normalizeName(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,]/g, "")
    .trim();
}

export function validateInvestorName(name: string): string | null {
  const t = name.trim();
  if (t.length < 2) return "Enter your full legal name.";
  if (t.length > MAX_NAME) return "Name is too long.";
  if (!/^[\p{L}\p{M}\s'.-]+$/u.test(t)) {
    return "Use letters for your name (hyphens and apostrophes allowed).";
  }
  return null;
}

export function validateInvestorEmail(email: string): string | null {
  if (!isValidInvestorEmail(email)) {
    return "Enter a valid email address (example: you@company.com).";
  }
  return null;
}

export function validateSignatureFormat(signature: string): string | null {
  const t = signature.trim();
  if (t.length < 2) return "Type your full legal name as your signature.";
  if (t.length > MAX_NAME) return "Signature is too long.";
  if (!/^[\p{L}\p{M}\s'.-]+$/u.test(t)) {
    return "Use letters in your signature (same characters as your name).";
  }
  return null;
}

export function validateSignatureMatch(investorName: string, signature: string): string | null {
  const nameErr = validateInvestorName(investorName);
  const sigErr = validateSignatureFormat(signature);
  if (nameErr || sigErr) return null;
  if (normalizeName(investorName) !== normalizeName(signature)) {
    return "Electronic signature must match your full legal name.";
  }
  return null;
}

export function validatePitchAccessAgreementFields(input: {
  investorName: string;
  investorEmail: string;
  signature: string;
  agreed?: boolean;
}): PitchAccessFieldErrors {
  const errors: PitchAccessFieldErrors = {};

  const nameErr = validateInvestorName(input.investorName);
  if (nameErr) errors.investorName = nameErr;

  const emailErr = validateInvestorEmail(input.investorEmail);
  if (emailErr) errors.investorEmail = emailErr;

  const sigErr = validateSignatureFormat(input.signature);
  if (sigErr) errors.signature = sigErr;

  if (!nameErr && !sigErr && !emailErr) {
    const matchErr = validateSignatureMatch(input.investorName, input.signature);
    if (matchErr) errors.signature = matchErr;
  }

  if (input.agreed === false) {
    errors.agreed = "You must agree to the Pitch Access Agreement to continue.";
  }

  return errors;
}

export function pitchAccessFieldsAreValid(input: {
  investorName: string;
  investorEmail: string;
  signature: string;
  agreed: boolean;
}): boolean {
  return Object.keys(validatePitchAccessAgreementFields(input)).length === 0 && input.agreed;
}
