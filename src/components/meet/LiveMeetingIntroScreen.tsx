'use client';

import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { useParableVideoAudio } from '@/hooks/useParableVideoAudio';

function liveMeetingIntroCandidateUrls(): string[] {
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
  const encodedPath = `/videos/${encodeURIComponent('Live Meeting.mp4')}`;
  const dedup: string[] = [];
  const seen = new Set<string>();
  for (const u of [...out, encodedPath]) {
    if (u && !seen.has(u)) {
      seen.add(u);
      dedup.push(u);
    }
  }
  return dedup.length > 0 ? dedup : [encodedPath];
}

const VIDEO_CANDIDATES = liveMeetingIntroCandidateUrls();

type Props = {
  onComplete: () => void;
  backHref?: string;
};

/**
 * Plays before the scheduled `/meet` lobby: optional CDN URL, then `public/videos/Live Meeting.mp4`.
 */
export function LiveMeetingIntroScreen({ onComplete, backHref = '/start' }: Props) {
  const [srcIndex, setSrcIndex] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const videoSrc = useMemo(
    () => VIDEO_CANDIDATES[Math.min(srcIndex, VIDEO_CANDIDATES.length - 1)]!,
    [srcIndex],
  );

  const { videoRef, muted, toggleMute } = useParableVideoAudio(videoSrc);

  const finish = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const onVideoError = useCallback(() => {
    setSrcIndex((prev) => {
      const next = prev + 1;
      if (next < VIDEO_CANDIDATES.length) {
        queueMicrotask(() => setLoadError(false));
        return next;
      }
      queueMicrotask(() => setLoadError(true));
      return prev;
    });
  }, []);

  return (
    <div className="relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-black text-white">
      <video
        key={videoSrc}
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        src={videoSrc}
        playsInline
        preload="auto"
        muted={muted}
        onEnded={finish}
        onError={onVideoError}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/75 via-black/20 to-black/85"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 z-[2] h-[min(34vh,11rem)] w-[min(60vw,17rem)] bg-gradient-to-tl from-black from-[8%] via-black/93 to-transparent md:hidden"
        aria-hidden
      />

      <header className="relative z-20 flex shrink-0 items-center justify-between gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <Link
          href={backHref}
          className="rounded-lg bg-black/45 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2ff]/90 backdrop-blur-md transition hover:bg-black/60 hover:text-[#00f2ff]"
        >
          ← Choice hub
        </Link>
        <button
          type="button"
          onClick={finish}
          className="rounded-lg border border-white/25 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md transition hover:bg-white/15"
        >
          Skip
        </button>
      </header>

      <div className="relative z-10 min-h-0 flex-1" aria-hidden />

      <footer className="relative z-20 flex shrink-0 flex-col items-center gap-4 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
        {loadError ? (
          <p className="max-w-md text-pretty text-center text-sm leading-relaxed text-amber-200/90">
            Add <code className="rounded bg-white/10 px-1 text-xs">public/videos/Live Meeting.mp4</code> for this step, or set{' '}
            <code className="rounded bg-white/10 px-1 text-xs">NEXT_PUBLIC_LIVE_MEETING_INTRO_VIDEO_URL</code> to a public{' '}
            <code className="rounded bg-white/10 px-1 text-xs">https://</code> MP4 URL, then redeploy. You can still continue
            to meeting options below.
          </p>
        ) : null}
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={muted}
          className="text-[11px] font-semibold uppercase tracking-wider text-[#00f2ff]/90 hover:text-[#00f2ff]"
        >
          {muted ? 'Unmute' : 'Mute'}
        </button>
        <button
          type="button"
          onClick={finish}
          className="w-full max-w-sm rounded-xl border border-[#00f2ff]/45 bg-[#00f2ff]/15 px-8 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-[#00f2ff] shadow-[0_0_28px_rgba(0,242,255,0.2)] backdrop-blur-sm transition hover:bg-[#00f2ff]/25 sm:tracking-[0.18em]"
        >
          Continue to meeting options
        </button>
      </footer>
    </div>
  );
}
