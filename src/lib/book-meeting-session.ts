/**
 * Client-only: persists post-registration data so we can redirect to `/book` (calendar step) and still
 * show meeting details + the scheduling embed.
 */
export const BOOK_MEETING_SESSION_KEY = 'parable:book-meeting';

export type BookMeetingSessionPayload = {
  at: number;
  emailStatus: 'sent' | 'unconfigured' | 'failed' | 'deferred' | 'already_sent';
  resendErrorMessage: string | null;
  roomLabel: string | null;
  roomSuffix: string | null;
  meetUrl: string | null;
  /** meeting_nda_evidence.id — for POST /api/meeting/send-confirmation */
  registrationId: string | null;
  contactEmail: string | null;
};

const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export function readBookMeetingSession(): BookMeetingSessionPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(BOOK_MEETING_SESSION_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<BookMeetingSessionPayload> & { at?: number };
    if (typeof p.at !== 'number' || Date.now() - p.at > MAX_AGE_MS) {
      sessionStorage.removeItem(BOOK_MEETING_SESSION_KEY);
      return null;
    }
    const full: BookMeetingSessionPayload = {
      at: p.at,
      emailStatus:
        p.emailStatus === 'sent' ||
        p.emailStatus === 'unconfigured' ||
        p.emailStatus === 'failed' ||
        p.emailStatus === 'deferred' ||
        p.emailStatus === 'already_sent'
          ? p.emailStatus
          : 'unconfigured',
      resendErrorMessage: p.resendErrorMessage === null || typeof p.resendErrorMessage === 'string' ? p.resendErrorMessage : null,
      roomLabel: typeof p.roomLabel === 'string' || p.roomLabel === null ? p.roomLabel : null,
      roomSuffix: typeof p.roomSuffix === 'string' || p.roomSuffix === null ? p.roomSuffix : null,
      meetUrl: typeof p.meetUrl === 'string' || p.meetUrl === null ? p.meetUrl : null,
      registrationId: typeof p.registrationId === 'string' || p.registrationId === null ? p.registrationId : null,
      contactEmail: typeof p.contactEmail === 'string' || p.contactEmail === null ? p.contactEmail : null,
    };
    return full;
  } catch {
    return null;
  }
}

export function writeBookMeetingSession(p: Omit<BookMeetingSessionPayload, 'at'>): void {
  if (typeof window === 'undefined') return;
  const full: BookMeetingSessionPayload = { ...p, at: Date.now() };
  try {
    sessionStorage.setItem(BOOK_MEETING_SESSION_KEY, JSON.stringify(full));
  } catch {
    /* quota / private mode */
  }
}

export function clearBookMeetingSession(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(BOOK_MEETING_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/** After send-confirmation; keeps room + registration id. */
export function mergeBookMeetingSession(updates: Partial<Omit<BookMeetingSessionPayload, 'at'>>) {
  const cur = readBookMeetingSession();
  if (!cur) return;
  writeBookMeetingSession({
    emailStatus: updates.emailStatus ?? cur.emailStatus,
    resendErrorMessage:
      updates.resendErrorMessage !== undefined ? updates.resendErrorMessage : cur.resendErrorMessage,
    roomLabel: updates.roomLabel !== undefined ? updates.roomLabel : cur.roomLabel,
    roomSuffix: updates.roomSuffix !== undefined ? updates.roomSuffix : cur.roomSuffix,
    meetUrl: updates.meetUrl !== undefined ? updates.meetUrl : cur.meetUrl,
    registrationId: updates.registrationId !== undefined ? updates.registrationId : cur.registrationId,
    contactEmail: updates.contactEmail !== undefined ? updates.contactEmail : cur.contactEmail,
  });
}
