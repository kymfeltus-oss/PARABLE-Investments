/** Same-origin path (space in filename). */
export const LIVE_MEETING_VIDEO_RELATIVE_PATH =
  '/videos/' + encodeURIComponent('Live Meeting.mp4');

/**
 * Optional CDN first, then `public/videos/Live Meeting.mp4`.
 * Used for the meet welcome stage (replaces `Welcome.mp4`).
 */
export function getLiveMeetingVideoCandidateUrls(): string[] {
  const out: string[] = [];
  const raw = process.env.NEXT_PUBLIC_LIVE_MEETING_INTRO_VIDEO_URL?.trim();
  if (raw) {
    try {
      const u = new URL(raw);
      if (u.protocol === 'https:' || u.protocol === 'http:') {
        out.push(u.href);
      }
    } catch {
      /* ignore */
    }
  }
  const dedup: string[] = [];
  const seen = new Set<string>();
  for (const u of [...out, LIVE_MEETING_VIDEO_RELATIVE_PATH]) {
    if (u && !seen.has(u)) {
      seen.add(u);
      dedup.push(u);
    }
  }
  return dedup.length > 0 ? dedup : [LIVE_MEETING_VIDEO_RELATIVE_PATH];
}
