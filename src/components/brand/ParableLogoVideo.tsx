'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useReducedMotion } from 'framer-motion';
import { getParableLogoDesktopSourceUrls, getParableLogoMobileSourceUrls } from '@/lib/investor-blob-sibling-urls';

/** Desktop hero tries `PARABLE Logo1.mp4` first, then legacy `PARABLE Logo.mp4`. */
export const PARABLE_LOGO_DESKTOP_CANDIDATES = [
  '/videos/' + encodeURIComponent('PARABLE Logo1.mp4'),
  '/videos/' + encodeURIComponent('PARABLE Logo.mp4'),
] as const;

/** Default desktop path (first candidate) — inline logo + external references. */
export const PARABLE_LOGO_VIDEO_SRC = PARABLE_LOGO_DESKTOP_CANDIDATES[0];

/** Portrait / mobile hero — file: `public/videos/PARABLE Mobile logo.mp4` */
export const PARABLE_LOGO_VIDEO_MOBILE_SRC =
  '/videos/' + encodeURIComponent('PARABLE Mobile logo.mp4');

function subscribeMaxWidth767(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(max-width: 767px)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function getMaxWidth767Matches(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
}

/**
 * Full-viewport looping background for the investor landing (under sparkles + copy).
 * Prefers unmuted playback so sound plays when the browser allows; if autoplay with sound is
 * blocked, falls back to muted playback and unmutes on first user gesture (tap/click/key).
 * Mobile: `PARABLE Mobile logo.mp4` + `object-contain` so the full frame fits (logo not blown up).
 * md+: desktop candidates above + `object-cover` for full-bleed hero.
 *
 * Uses a single `src` (not two `<source media>` children): many browsers ignore `media` on
 * `<source>` inside `<video>` and would always load the first listed file (mobile on desktop).
 */
export function LandingHeroBackgroundVideo() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [desktopIdx, setDesktopIdx] = useState(0);
  const [mobileIdx, setMobileIdx] = useState(0);
  const narrowViewport = useSyncExternalStore(subscribeMaxWidth767, getMaxWidth767Matches, () => false);
  const desktopCands = useMemo(() => getParableLogoDesktopSourceUrls(), []);
  const mobileCands = useMemo(() => getParableLogoMobileSourceUrls(), []);
  const desktopSrc = desktopCands[Math.min(desktopIdx, Math.max(0, desktopCands.length - 1))]!;
  const mobileSrc = mobileCands[Math.min(mobileIdx, Math.max(0, mobileCands.length - 1))]!;
  const activeSrc = narrowViewport ? mobileSrc : desktopSrc;

  const tryPlayPreferSound = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = 1;
    el.muted = false;
    setMuted(false);
    void el.play().catch(() => {
      el.muted = true;
      setMuted(true);
      void el.play().catch(() => {});
    });
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.load();
    const onReady = () => tryPlayPreferSound();
    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onReady();
    else el.addEventListener('canplay', onReady, { once: true });

    return () => {
      el.removeEventListener('canplay', onReady);
    };
  }, [tryPlayPreferSound, activeSrc]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const unmute = () => {
      setMuted(false);
      el.muted = false;
      void el.play().catch(() => {});
    };

    const opts = { once: true, passive: true } as const;
    window.addEventListener('pointerdown', unmute, opts);
    window.addEventListener('keydown', unmute, opts);

    return () => {
      window.removeEventListener('pointerdown', unmute);
      window.removeEventListener('keydown', unmute);
    };
  }, []);

  const onVideoError = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 767px)').matches) {
      setMobileIdx((i) => (i + 1 < mobileCands.length ? i + 1 : i));
    } else {
      setDesktopIdx((i) => (i + 1 < desktopCands.length ? i + 1 : i));
    }
  }, [mobileCands.length, desktopCands.length]);

  if (reduceMotion) {
    return <div className="fixed inset-0 z-0 bg-[#070708]" aria-hidden />;
  }

  return (
    <div className="fixed inset-0 z-0 max-h-[100dvh] max-w-[100vw] overflow-hidden">
      <div className="absolute inset-0 min-h-0 min-w-0 overflow-hidden">
        <video
          key={activeSrc}
          ref={videoRef}
          className="absolute inset-0 box-border max-h-full max-w-full min-h-0 min-w-0 h-full w-full bg-[#070708] object-contain object-center md:object-cover"
          src={activeSrc}
          autoPlay
          muted={muted}
          loop
          playsInline
          preload="auto"
          aria-label="PARABLE background"
          onError={onVideoError}
        />
      </div>
      {/* Descript (and similar) trial watermarks are baked into the MP4 — mask BR on small screens until you re-export clean video. */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 z-[1] h-[min(30vh,10rem)] w-[min(56vw,15rem)] bg-gradient-to-tl from-[#070708] from-[10%] via-[#070708]/92 to-transparent md:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/40 via-black/[0.18] to-black/50"
        aria-hidden
      />
      <div className="pointer-events-auto absolute bottom-[max(5.5rem,env(safe-area-inset-bottom)+4rem)] left-4 z-[3] sm:left-6">
        <button
          type="button"
          onClick={() => {
            const el = videoRef.current;
            if (!el) return;
            const next = !el.muted;
            el.muted = next;
            el.volume = 1;
            setMuted(next);
            void el.play().catch(() => {});
          }}
          aria-pressed={muted}
          className="rounded-lg border border-white/20 bg-black/55 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm hover:bg-black/70"
        >
          {muted ? 'Unmute' : 'Mute'}
        </button>
      </div>
    </div>
  );
}

