'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

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

/** Investor landing intro — `public/intro/parable-intro.mp4` */
export const PARABLE_LANDING_INTRO_VIDEO_SRC = '/intro/parable-intro.mp4';

function landingIntroVideoCandidateUrls(): string[] {
  const out: string[] = [];
  const raw = process.env.NEXT_PUBLIC_PARABLE_LANDING_INTRO_VIDEO_URL?.trim();
  if (raw) {
    try {
      const u = new URL(raw);
      if (u.protocol === 'https:' || u.protocol === 'http:') out.push(u.href);
    } catch {
      /* ignore invalid env */
    }
  }
  const seen = new Set<string>();
  const dedup: string[] = [];
  for (const u of [...out, PARABLE_LANDING_INTRO_VIDEO_SRC]) {
    if (u && !seen.has(u)) {
      seen.add(u);
      dedup.push(u);
    }
  }
  return dedup.length > 0 ? dedup : [PARABLE_LANDING_INTRO_VIDEO_SRC];
}

/**
 * Full-viewport intro for the investor landing (`public/intro/parable-intro.mp4`).
 * Plays once; optional `onEnded` for advance. Prefers unmuted autoplay; falls back to muted
 * and unmutes on first user gesture. Override with `NEXT_PUBLIC_PARABLE_LANDING_INTRO_VIDEO_URL`.
 */
export type LandingHeroBackgroundVideoProps = {
  /** Fired when the intro clip finishes (landing does not loop). */
  onEnded?: () => void;
};

export function LandingHeroBackgroundVideo({ onEnded }: LandingHeroBackgroundVideoProps = {}) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const candidates = useMemo(() => landingIntroVideoCandidateUrls(), []);
  const activeSrc = candidates[Math.min(srcIndex, candidates.length - 1)]!;

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
    setSrcIndex((i) => (i + 1 < candidates.length ? i + 1 : i));
  }, [candidates.length]);

  if (reduceMotion) {
    return <div className="fixed inset-0 z-0 bg-[#030712]" aria-hidden />;
  }

  return (
    <div className="fixed inset-0 z-0 max-h-[100dvh] max-w-[100vw] overflow-hidden">
      <div className="absolute inset-0 min-h-0 min-w-0 overflow-hidden">
        <video
          key={activeSrc}
          ref={videoRef}
          suppressHydrationWarning
          className="absolute inset-0 box-border max-h-full max-w-full min-h-0 min-w-0 h-full w-full bg-[#030712] object-contain object-center md:object-cover"
          src={activeSrc}
          autoPlay
          muted={muted}
          playsInline
          preload="auto"
          aria-label="PARABLE investor introduction"
          onEnded={onEnded}
          onError={onVideoError}
        />
      </div>
      {/* Descript (and similar) trial watermarks are baked into the MP4 — mask BR on small screens until you re-export clean video. */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 z-[1] h-[min(30vh,10rem)] w-[min(56vw,15rem)] bg-gradient-to-tl from-[#030712] from-[10%] via-[#030712]/92 to-transparent md:hidden"
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

