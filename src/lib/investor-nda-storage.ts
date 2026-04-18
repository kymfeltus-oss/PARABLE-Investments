/** localStorage key — bump suffix if NDA / non-compete text materially changes. */
export const INVESTOR_NDA_STORAGE_KEY = 'parable_investor_nda_accepted_v2';

export function getInvestorNdaAccepted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(INVESTOR_NDA_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setInvestorNdaAccepted(): void {
  try {
    localStorage.setItem(INVESTOR_NDA_STORAGE_KEY, 'true');
  } catch {
    /* ignore quota / private mode */
  }
}

/** Only allow same-origin paths (no open redirect). */
export function sanitizeNextPath(raw: string | null): string {
  if (!raw || typeof raw !== 'string') return '/start';
  const t = raw.trim();
  if (!t.startsWith('/') || t.startsWith('//')) return '/start';
  if (t.includes(':')) return '/start';
  return t;
}
