import { getLiveMeetingVideoAllCandidateUrls } from '@/lib/investor-blob-sibling-urls';

/** Same-origin path (space in filename). */
export const LIVE_MEETING_VIDEO_RELATIVE_PATH =
  '/videos/' + encodeURIComponent('Live Meeting.mp4');

/**
 * Explicit `NEXT_PUBLIC_LIVE_MEETING_INTRO_VIDEO_URL` first, then a sibling of
 * `NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL` (`.../Live%20Meeting.mp4`), then `public/videos`.
 */
export function getLiveMeetingVideoCandidateUrls(): string[] {
  return getLiveMeetingVideoAllCandidateUrls();
}
