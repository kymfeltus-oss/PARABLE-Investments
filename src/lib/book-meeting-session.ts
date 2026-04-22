/**
 * Client-only: persists post-registration data so we can redirect to `/book/finish` and still
 * show meeting details + the scheduling embed.
 */
export const BOOK_MEETING_SESSION_KEY = 'parable:book-meeting';

export type BookMeetingSessionPayload = {
  at: number;
  emailStatus: 'sent' | 'unconfigured' | 'failed';
  resendErrorMessage: string | null;
  roomLabel: string | null;
  roomSuffix: string | null;
  meetUrl: string | null;
};

const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export function readBookMeetingSession(): BookMeetingSessionPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(BOOK_MEETING_SESSION_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as BookMeetingSessionPayload;
    if (typeof p.at !== 'number' || Date.now() - p.at > MAX_AGE_MS) {
      sessionStorage.removeItem(BOOK_MEETING_SESSION_KEY);
      return null;
    }
    return p;
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
