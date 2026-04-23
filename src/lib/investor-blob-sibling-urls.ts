/**
 * When `public/videos` is empty on the deploy host (Git LFS not expanded, or gitignored files),
 * MP4s can be served from the same Vercel Blob (or any HTTPS bucket) as
 * `NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL` by replacing the `Investor Intro.mp4` filename segment.
 * Upload matching keys next to `Investor Intro.mp4` in Blob.
 */
export function siblingOfInvestorIntroUrl(introUrl: string, percentEncodedFileName: string): string | null {
  const t = introUrl?.trim() ?? '';
  const leaf = percentEncodedFileName?.trim() ?? '';
  if (!t || !leaf || !/^https?:\/\//i.test(t)) return null;
  if (/Investor%20Intro\.mp4/i.test(t)) {
    return t.replace(/Investor%20Intro\.mp4/gi, leaf);
  }
  if (/InvestorIntro\.mp4/i.test(t)) {
    return t.replace(/InvestorIntro\.mp4/gi, leaf);
  }
  return null;
}

const INTRO = process.env.NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL?.trim() ?? '';

function pushSibling(out: string[], filenameEncoded: string) {
  if (!INTRO) return;
  const u = siblingOfInvestorIntroUrl(INTRO, filenameEncoded);
  if (u && out.every((e) => e !== u)) out.push(u);
}

/**
 * `Live Meeting.mp4` on the same base URL as the intro blob, then explicit live env, then /videos.
 */
export function getLiveMeetingVideoAllCandidateUrls(): string[] {
  const out: string[] = [];
  const explicit = process.env.NEXT_PUBLIC_LIVE_MEETING_INTRO_VIDEO_URL?.trim();
  if (explicit) {
    try {
      const u = new URL(explicit);
      if (u.protocol === 'https:' || u.protocol === 'http:') out.push(u.href);
    } catch {
      /* */
    }
  }
  pushSibling(out, 'Live%20Meeting.mp4');
  const rel = '/videos/' + encodeURIComponent('Live Meeting.mp4');
  if (out.every((e) => e !== rel)) out.push(rel);
  return out.length > 0 ? out : [rel];
}

/** Desktop logo loop: blob sibling first, then /videos candidates. */
export function getParableLogoDesktopSourceUrls(): string[] {
  const out: string[] = [];
  pushSibling(out, 'PARABLE%20Logo1.mp4');
  pushSibling(out, 'PARABLE%20Logo.mp4');
  const locals = [
    '/videos/' + encodeURIComponent('PARABLE Logo1.mp4'),
    '/videos/' + encodeURIComponent('PARABLE Logo.mp4'),
  ];
  for (const p of locals) {
    if (out.every((e) => e !== p)) out.push(p);
  }
  return out.length > 0 ? out : [locals[0]!];
}

/** Mobile logo: blob sibling, then /videos. */
export function getParableLogoMobileSourceUrls(): string[] {
  const out: string[] = [];
  pushSibling(out, 'PARABLE%20Mobile%20logo.mp4');
  const p = '/videos/' + encodeURIComponent('PARABLE Mobile logo.mp4');
  if (out.every((e) => e !== p)) out.push(p);
  return out.length > 0 ? out : [p];
}

/** After explicit flash env, try sibling from intro, then /videos. */
export function getInvestorFlashVideoAllCandidateUrls(): string[] {
  const out: string[] = [];
  const raw = process.env.NEXT_PUBLIC_INVESTOR_FLASH_VIDEO_URL?.trim();
  if (raw) {
    try {
      const u = new URL(raw);
      if (u.protocol === 'https:' || u.protocol === 'http:') out.push(u.href);
    } catch {
      /* */
    }
  }
  pushSibling(out, 'Investor%20Flash.mp4');
  const rel = '/videos/' + encodeURIComponent('Investor Flash.mp4');
  if (out.every((e) => e !== rel)) out.push(rel);
  return out.length > 0 ? out : [rel];
}
