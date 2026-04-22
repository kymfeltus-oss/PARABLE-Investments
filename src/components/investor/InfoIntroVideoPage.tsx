'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

/** Local path (not in git if >100MB) or override via `NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL` (HTTPS). */
const VIDEO_SRC =
  process.env.NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL?.trim() || '/videos/Investor%20Intro.mp4';

export type InfoIntroVideoPageProps = {
  /** “Back” link in the header (default: choice hub). */
  backHref?: string;
  /** Route after Skip, Continue, or when the video ends (default: `/info`). */
  continueHref?: string;
  /** Primary CTA under the player. */
  continueButtonLabel?: string;
};

/**
 * Full-viewport welcome video — `/info/intro` and `/investor/portal` (before proposal).
 * Uses `object-cover` edge-to-edge in the stage; controls sit in safe-area overlays for phone + desktop.
 */
export function InfoIntroVideoPage({
  backHref = '/start',
  continueHref = '/info',
  continueButtonLabel = 'Continue to materials',
}: InfoIntroVideoPageProps = {}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadError, setLoadError] = useState(false);

  const goNext = useCallback(() => {
    router.push(continueHref);
  }, [router, continueHref]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const tryPlay = () => {
      el.muted = true;
      void el.play().catch(() => {});
    };

    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) tryPlay();
    else el.addEventListener('canplay', tryPlay, { once: true });
  }, []);

  return (
    <div className="relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        src={VIDEO_SRC}
        playsInline
        preload="auto"
        muted
        onEnded={goNext}
        onError={() => setLoadError(true)}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/75 via-black/20 to-black/85"
        aria-hidden
      />

      <header
        className="relative z-20 flex shrink-0 items-center justify-between gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6"
      >
        <Link
          href={backHref}
          className="rounded-lg bg-black/45 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2ff]/90 backdrop-blur-md transition hover:bg-black/60 hover:text-[#00f2ff]"
        >
          ← Choice hub
        </Link>
        <button
          type="button"
          onClick={goNext}
          className="rounded-lg border border-white/25 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md transition hover:bg-white/15"
        >
          Skip
        </button>
      </header>

      <div className="relative z-10 min-h-0 flex-1" aria-hidden />

      <footer className="relative z-20 flex shrink-0 flex-col items-center gap-4 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
        {loadError ? (
          <p className="max-w-md text-center text-sm text-amber-200/90">
            Could not load the intro video. Add <code className="rounded bg-white/10 px-1 text-xs">public/videos/Investor Intro.mp4</code> locally, set{' '}
            <code className="rounded bg-white/10 px-1 text-xs">NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL</code> to a public HTTPS file, then refresh.
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => {
            const el = videoRef.current;
            if (el) {
              el.muted = !el.muted;
              void el.play().catch(() => {});
            }
          }}
          className="text-[11px] font-semibold uppercase tracking-wider text-[#00f2ff]/90 hover:text-[#00f2ff]"
        >
          Toggle sound
        </button>
        <button
          type="button"
          onClick={goNext}
          className="w-full max-w-sm rounded-xl border border-[#00f2ff]/45 bg-[#00f2ff]/15 px-8 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-[#00f2ff] shadow-[0_0_28px_rgba(0,242,255,0.2)] backdrop-blur-sm transition hover:bg-[#00f2ff]/25 sm:tracking-[0.18em]"
        >
          {continueButtonLabel}
        </button>
      </footer>
    </div>
  );
}
