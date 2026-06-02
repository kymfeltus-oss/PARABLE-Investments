/** UX-only flags — not legal records. Signed pitch_access_agreements rows are the source of truth. */
export const PITCH_ACCESS_SIGNED_STORAGE_KEY = "pitchlock_access_agreement_signed_v1";
export const PITCH_ACCESS_EMAIL_STATUS_KEY = "pitchlock_last_email_status";
export const PITCH_ACCESS_INVESTOR_NAME_KEY = "pitchlock_investor_name_v1";
export const PITCH_ACCESS_INVESTOR_EMAIL_KEY = "pitchlock_investor_email_v1";

export type StoredEmailStatus = {
  status: string;
  error?: string | null;
  at: string;
};

export function setPitchAccessSignedFlag(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PITCH_ACCESS_SIGNED_STORAGE_KEY, new Date().toISOString());
  } catch {
    /* ignore quota / private mode */
  }
}

/** UX-only — from NDA sign form; not a legal record */
export function setInvestorSession(name: string, email: string): void {
  if (typeof window === "undefined") return;
  try {
    const n = name.trim().slice(0, 200);
    const e = email.trim().toLowerCase().slice(0, 320);
    if (n) localStorage.setItem(PITCH_ACCESS_INVESTOR_NAME_KEY, n);
    if (e) localStorage.setItem(PITCH_ACCESS_INVESTOR_EMAIL_KEY, e);
  } catch {
    /* ignore */
  }
}

export function getInvestorSessionName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(PITCH_ACCESS_INVESTOR_NAME_KEY);
  } catch {
    return null;
  }
}

export function hasPitchAccessSignedFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(localStorage.getItem(PITCH_ACCESS_SIGNED_STORAGE_KEY));
  } catch {
    return false;
  }
}

export function setLastEmailStatus(status: string, error?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredEmailStatus = { status, error: error ?? null, at: new Date().toISOString() };
    sessionStorage.setItem(PITCH_ACCESS_EMAIL_STATUS_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function consumeLastEmailStatus(): StoredEmailStatus | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PITCH_ACCESS_EMAIL_STATUS_KEY);
    sessionStorage.removeItem(PITCH_ACCESS_EMAIL_STATUS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredEmailStatus;
  } catch {
    return null;
  }
}
