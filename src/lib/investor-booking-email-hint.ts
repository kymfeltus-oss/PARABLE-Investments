/** Optional hint from `/nda` so `/book` can pre-fill email (same browser). Not security-sensitive — user may edit. */
const KEY = 'parable_investor_booking_email_hint_v1';

export function setInvestorBookingEmailHint(email: string): void {
  if (typeof window === 'undefined') return;
  const t = email.trim().toLowerCase().slice(0, 320);
  if (!t) return;
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* quota / private mode */
  }
}

export function getInvestorBookingEmailHint(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(KEY)?.trim() ?? '';
  } catch {
    return '';
  }
}
