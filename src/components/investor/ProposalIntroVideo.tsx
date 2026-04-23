'use client';

import { useCallback, useMemo, useState } from 'react';

/** On-disk filename (typo preserved to match `public/videos`). */
const PROPOSAL_INTRO_LOCAL = 'Propsal Intro Video.mp4';

/** Same Vercel Blob bucket as `NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL` — upload one of these keys next to `Investor Intro.mp4`. */
function proposalIntroBlobSiblingUrls(): string[] {
  const intro = process.env.NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL?.trim();
  if (!intro || !/^https?:\/\//i.test(intro)) return [];
  const leaves = [
    'Propsal%20Intro%20Video.mp4',
    'Proposal%20Intro%20Video.mp4',
    'Proposal%20Presentation.mp4',
  ];
  const out: string[] = [];
  for (const leaf of leaves) {
    let href: string | null = null;
    if (/Investor%20Intro\.mp4$/i.test(intro)) {
      href = intro.replace(/Investor%20Intro\.mp4$/i, leaf);
    } else if (/InvestorIntro\.mp4$/i.test(intro)) {
      href = intro.replace(/InvestorIntro\.mp4$/i, leaf);
    }
    if (href && href !== intro && !out.includes(href)) out.push(href);
  }
  return out;
}

function proposalIntroCandidateUrls(): string[] {
  const out: string[] = [];
  const raw = process.env.NEXT_PUBLIC_PROPOSAL_PRESENTATION_VIDEO_URL?.trim();
  if (raw) {
    try {
      const u = new URL(raw);
      if (u.protocol === 'https:' || u.protocol === 'http:') {
        out.push(u.href);
      }
    } catch {
      /* ignore invalid env */
    }
  }
  for (const u of proposalIntroBlobSiblingUrls()) {
    if (!out.includes(u)) out.push(u);
  }
  const locals = [
    `/videos/${encodeURIComponent(PROPOSAL_INTRO_LOCAL)}`,
    `/videos/${encodeURIComponent('Proposal Presentation.mp4')}`,
  ];
  const seen = new Set<string>();
  const dedup: string[] = [];
  for (const u of [...out, ...locals]) {
    if (u && !seen.has(u)) {
      seen.add(u);
      dedup.push(u);
    }
  }
  return dedup.length > 0 ? dedup : [`/videos/${encodeURIComponent(PROPOSAL_INTRO_LOCAL)}`];
}

/**
 * Proposal tab intro clip — fills the 16:9 slot on `/investor/portal/proposal`.
 * Sources: `NEXT_PUBLIC_PROPOSAL_PRESENTATION_VIDEO_URL`, then local `public/videos` candidates.
 */
export function ProposalIntroVideo() {
  const [srcIndex, setSrcIndex] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const candidates = useMemo(() => proposalIntroCandidateUrls(), []);
  const videoSrc = useMemo(
    () => candidates[Math.min(srcIndex, candidates.length - 1)]!,
    [candidates, srcIndex],
  );

  const onVideoError = useCallback(() => {
    setSrcIndex((prev) => {
      const next = prev + 1;
      if (next < candidates.length) {
        queueMicrotask(() => setLoadError(false));
        return next;
      }
      queueMicrotask(() => setLoadError(true));
      return prev;
    });
  }, [candidates]);

  if (loadError) {
    return (
      <div
        className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-amber-500/35 bg-black/50 p-6 text-center"
        role="alert"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-200/90">Video unavailable</p>
        <p className="max-w-md text-pretty text-[11px] leading-relaxed text-white/45 sm:text-xs">
          Upload the MP4 to the same store as <code className="rounded bg-white/10 px-1">Investor Intro</code> (e.g.{' '}
          <code className="rounded bg-white/10 px-1">Propsal%20Intro%20Video.mp4</code> next to it), add{' '}
          <code className="rounded bg-white/10 px-1">public/videos/{PROPOSAL_INTRO_LOCAL}</code> with Git LFS, or set{' '}
          <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_PROPOSAL_PRESENTATION_VIDEO_URL</code>, then redeploy.
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-white/15 bg-black shadow-[0_0_40px_rgba(0,242,255,0.08)]">
      <video
        key={videoSrc}
        className="box-border h-full w-full max-h-full max-w-full object-contain object-center md:object-cover"
        src={videoSrc}
        controls
        playsInline
        preload="metadata"
        onError={onVideoError}
      />
    </div>
  );
}
