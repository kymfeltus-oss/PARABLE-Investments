/** Resend email configuration. */

const DEFAULT_FROM = "Pitch Lock <onboarding@resend.dev>";

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function isFromEmailConfigured(): boolean {
  const raw = process.env.RESEND_FROM_EMAIL?.trim();
  if (!raw) return false;
  if (raw.startsWith("re_")) return false;
  const match = raw.match(/<([^>]+)>/);
  const addr = (match ? match[1] : raw).trim();
  return addr.includes("@");
}

export function resolveResendFromAddress(): string {
  const raw = process.env.RESEND_FROM_EMAIL?.trim();
  if (!raw) return DEFAULT_FROM;

  if (raw.includes("<") && raw.includes(">")) return raw;

  if (raw.includes("@")) {
    return raw.startsWith("re_") ? DEFAULT_FROM : `Pitch Lock <${raw.toLowerCase()}>`;
  }

  return DEFAULT_FROM;
}

export function resolvePresenterAlertEmail(): string | null {
  const owner = process.env.OWNER_ALERT_EMAIL?.trim().toLowerCase();
  if (owner?.includes("@")) return owner;
  return null;
}
