'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParableVideoAudio } from '@/hooks/useParableVideoAudio';

/** Persisted after `onEnded` once — unlocks Skip / Continue on future visits (intro variant only). */
export const INTRO_FULL_PLAY_STORAGE_KEY = 'parable_investor_intro_full_play_v1';

/** Passed to `onComplete` so the host can branch (e.g. natural video end → hub, Skip / Continue → deck). */
export type IntroExitDetail = { via: 'manual' } | { via: 'video-ended' };

/** Build-time list: optional HTTPS override, then same-origin static paths (space in filename). */
function introVideoCandidateUrls(): string[] {
  const out: string[] = [];
  const raw = process.env.NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL?.trim();
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
  const encodedPath = `/videos/${encodeURIComponent('Investor Intro.mp4')}`;
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

function flashVideoCandidateUrls(): string[] {
  const out: string[] = [];
  const raw = process.env.NEXT_PUBLIC_INVESTOR_FLASH_VIDEO_URL?.trim();
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
  const encodedPath = `/videos/${encodeURIComponent('Investor Flash.mp4')}`;
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

export type InfoIntroVideoPageProps = {
  /** Which asset to play (`intro` = Investor Intro, `flash` = Investor Flash). */
  variant?: 'intro' | 'flash';
  /** “Back” link in the header (default: choice hub). */
  backHref?: string;
  /** Visible label for the back link (default: `← Choice hub`). */
  backLabel?: string;
  /** Route after Skip, Continue, or when the video ends — ignored when `onComplete` is set. */
  continueHref?: string;
  /** Primary CTA under the player. */
  continueButtonLabel?: string;
  /** When set, Skip / Continue / `onEnded` call this instead of navigating to `continueHref`. */
  onComplete?: (detail: IntroExitDetail) => void;
  /**
   * When `true` with `variant="intro"`, Skip and Continue stay disabled until the video fires `onEnded`
   * at least once in this browser (stored in localStorage). After that, bypass is allowed on later visits.
   */
  requireFullPlayOnce?: boolean;
};

/**
 * Full-viewport welcome video — `/info/intro`, `/investor/portal` (flash), and the intro gate on
 * `/investor/portal/proposal`. Tries unmuted playback first; **Mute** / **Unmute** in the footer.
 */
export function InfoIntroVideoPage({
  variant = 'intro',
  backHref = '/start',
  backLabel = '← Choice hub',
  continueHref = '/info',
  continueButtonLabel = 'Continue to materials',
  onComplete,
  requireFullPlayOnce = false,
}: InfoIntroVideoPageProps = {}) {
  const router = useRouter();
  const [srcIndex, setSrcIndex] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [introGateChecked, setIntroGateChecked] = useState(false);
  const [introPlayPersisted, setIntroPlayPersisted] = useState(false);
  const [sessionFullPlayDone, setSessionFullPlayDone] = useState(false);

  const introGateActive = Boolean(requireFullPlayOnce && variant === 'intro');

  useEffect(() => {
    queueMicrotask(() => {
      if (!introGateActive) {
        setIntroGateChecked(true);
        return;
      }
      try {
        if (typeof window !== 'undefined' && localStorage.getItem(INTRO_FULL_PLAY_STORAGE_KEY) === '1') {
          setIntroPlayPersisted(true);
        }
      } catch {
        /* private mode / quota */
      } finally {
        setIntroGateChecked(true);
      }
    });
  }, [introGateActive]);

  const canBypassIntroGate =
    !introGateActive ||
    loadError ||
    (introGateChecked && (introPlayPersisted || sessionFullPlayDone));

  const candidates = useMemo(
    () => (variant === 'flash' ? flashVideoCandidateUrls() : introVideoCandidateUrls()),
    [variant],
  );

  const videoSrc = useMemo(
    () => candidates[Math.min(srcIndex, candidates.length - 1)]!,
    [candidates, srcIndex],
  );

  const { videoRef, muted, toggleMute } = useParableVideoAudio(videoSrc);

  const goNext = useCallback(() => {
    if (introGateActive && !canBypassIntroGate) {
      return;
    }
    if (onComplete) {
      onComplete({ via: 'manual' });
      return;
    }
    router.push(continueHref);
  }, [router, continueHref, onComplete, introGateActive, canBypassIntroGate]);

  const persistFullIntroWatch = useCallback(() => {
    if (!introGateActive) return;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(INTRO_FULL_PLAY_STORAGE_KEY, '1');
      }
    } catch {
      /* ignore */
    }
    setIntroPlayPersisted(true);
    setSessionFullPlayDone(true);
  }, [introGateActive]);

  /** Full play-through: persists intro gate when applicable, then advances (not subject to Skip/Continue gate). */
  const onVideoEnded = useCallback(() => {
    persistFullIntroWatch();
    if (onComplete) {
      onComplete({ via: 'video-ended' });
      return;
    }
    router.push(continueHref);
  }, [persistFullIntroWatch, onComplete, router, continueHref]);

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

  /** Portal flash only: on phones, bound the video between chrome so `object-contain` fits the frame; `md+` unchanged. */
  const videoClassName =
    variant === 'flash'
      ? [
          'absolute z-0 box-border min-h-0 min-w-0 bg-black',
          'max-md:left-0 max-md:right-0 max-md:w-full max-md:max-w-full',
          'max-md:top-[calc(env(safe-area-inset-top)+4.25rem)] max-md:bottom-[calc(env(safe-area-inset-bottom)+10.75rem)]',
          'max-md:object-contain max-md:object-center',
          'md:inset-0 md:h-full md:w-full md:object-cover md:object-center',
        ].join(' ')
      : 'absolute inset-0 z-0 box-border max-h-full max-w-full min-h-0 min-w-0 h-full w-full object-contain object-center md:object-cover';

  const errorCopy =
    variant === 'flash' ? (
      <>
        This deployment does not have the flash file in git (GitHub 100MB limit). Do one of: add{' '}
        <code className="rounded bg-white/10 px-1 text-xs">public/videos/Investor Flash.mp4</code> on the server build
        machine, or set <code className="rounded bg-white/10 px-1 text-xs">NEXT_PUBLIC_INVESTOR_FLASH_VIDEO_URL</code>{' '}
        in Vercel to a public <code className="rounded bg-white/10 px-1 text-xs">https://</code> MP4 URL, then redeploy.
      </>
    ) : (
      <>
        This deployment does not have the intro file in git (GitHub 100MB limit). Do one of: add{' '}
        <code className="rounded bg-white/10 px-1 text-xs">public/videos/Investor Intro.mp4</code> on the server build
        machine, or set <code className="rounded bg-white/10 px-1 text-xs">NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL</code>{' '}
        in Vercel to a public <code className="rounded bg-white/10 px-1 text-xs">https://</code> MP4 URL, then redeploy.
      </>
    );

  return (
    <div className="relative flex h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden bg-black text-white">
      <video
        key={videoSrc}
        ref={videoRef}
        className={videoClassName}
        src={videoSrc}
        playsInline
        preload="auto"
        muted={muted}
        onEnded={onVideoEnded}
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

      <header
        className="relative z-20 flex shrink-0 items-center justify-between gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6"
      >
        <Link
          href={backHref}
          className="rounded-lg bg-black/45 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00f2ff]/90 backdrop-blur-md transition hover:bg-black/60 hover:text-[#00f2ff]"
        >
          {backLabel}
        </Link>
        <button
          type="button"
          onClick={goNext}
          disabled={introGateActive && !canBypassIntroGate}
          aria-disabled={introGateActive && !canBypassIntroGate}
          title={
            introGateActive && !canBypassIntroGate ? 'Watch the full video once to unlock Skip' : undefined
          }
          className="rounded-lg border border-white/25 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md transition hover:bg-white/15 disabled:pointer-events-none disabled:opacity-35"
        >
          Skip
        </button>
      </header>

      <div className="relative z-10 min-h-0 flex-1" aria-hidden />

      <footer className="relative z-20 flex shrink-0 flex-col items-center gap-4 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
        {loadError ? (
          <p className="max-w-md text-pretty text-center text-sm leading-relaxed text-amber-200/90">{errorCopy}</p>
        ) : null}
        {introGateActive && !loadError ? (
          <p className="max-w-sm text-pretty text-center text-[11px] leading-relaxed text-white/45 sm:text-xs">
            {!introGateChecked
              ? 'Preparing secure playback…'
              : canBypassIntroGate
                ? 'You can skip or continue anytime — full intro already completed in this browser.'
                : 'Watch the full video once (let it play to the end). Skip and Continue unlock after that.'}
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
          onClick={goNext}
          disabled={introGateActive && !canBypassIntroGate}
          aria-disabled={introGateActive && !canBypassIntroGate}
          title={
            introGateActive && !canBypassIntroGate
              ? 'Watch the full video once to unlock Continue'
              : undefined
          }
          className="w-full max-w-sm rounded-xl border border-[#00f2ff]/45 bg-[#00f2ff]/15 px-8 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-[#00f2ff] shadow-[0_0_28px_rgba(0,242,255,0.2)] backdrop-blur-sm transition hover:bg-[#00f2ff]/25 disabled:pointer-events-none disabled:opacity-35 sm:tracking-[0.18em]"
        >
          {continueButtonLabel}
        </button>
      </footer>
    </div>
  );
}
