'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { useParableVideoAudio } from '@/hooks/useParableVideoAudio';

type Props = {
  className?: string;
  /** Max width of the logo area (Tailwind class). */
  maxWidthClass?: string;
};

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

/**
 * Full-viewport looping background for the investor landing (under sparkles + copy).
 * Prefers unmuted playback so sound plays when the browser allows; if autoplay with sound is
 * blocked, falls back to muted playback and unmutes on first user gesture (tap/click/key).
 * Mobile: `PARABLE Mobile logo.mp4` + `object-contain` so the full frame fits (logo not blown up).
 * md+: desktop candidates above + `object-cover` for full-bleed hero.
 */
export function LandingHeroBackgroundVideo() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [desktopIdx, setDesktopIdx] = useState(0);
  const desktopSrc =
    PARABLE_LOGO_DESKTOP_CANDIDATES[
      Math.min(desktopIdx, PARABLE_LOGO_DESKTOP_CANDIDATES.length - 1)
    ];

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
  }, [tryPlayPreferSound, desktopIdx]);

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

  /** Re-evaluate `<source media>` when crossing mobile/desktop (rotate, resize). */
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = () => {
      el.load();
      el.addEventListener('canplay', () => tryPlayPreferSound(), { once: true });
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [tryPlayPreferSound]);

  const bumpDesktopOnError = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 767px)').matches) return;
    setDesktopIdx((i) =>
      i + 1 < PARABLE_LOGO_DESKTOP_CANDIDATES.length ? i + 1 : i
    );
  }, []);

  if (reduceMotion) {
    return <div className="fixed inset-0 z-0 bg-[#070708]" aria-hidden />;
  }

  return (
    <div className="fixed inset-0 z-0 max-h-[100dvh] max-w-[100vw] overflow-hidden">
      <div className="absolute inset-0 min-h-0 min-w-0 overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 box-border max-h-full max-w-full min-h-0 min-w-0 h-full w-full bg-[#070708] object-contain object-center md:object-cover"
          autoPlay
          muted={muted}
          loop
          playsInline
          preload="auto"
          aria-label="PARABLE background"
          onError={bumpDesktopOnError}
        >
          <source
            src={PARABLE_LOGO_VIDEO_MOBILE_SRC}
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source src={desktopSrc} type="video/mp4" />
        </video>
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

/**
 * Inline animated logo (e.g. reduced-motion areas). Falls back to {@link ParableLogoMark}
 * when the user prefers reduced motion.
 */
function CenteredAutoplayFromUrl({ src, label }: { src: string; label: string }) {
  const { videoRef, muted, toggleMute } = useParableVideoAudio(src);

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-5xl overflow-hidden px-1">
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[1.5rem] bg-[radial-gradient(ellipse_80%_80%_at_50%_45%,rgba(0,242,255,0.14)_0%,rgba(10,12,18,0.95)_50%,#050506_100%)]"
        aria-hidden
      />
      <video
        ref={videoRef}
        className="relative box-border max-h-[min(52dvh,30rem)] w-full object-contain object-center shadow-[0_0_40px_rgba(0,242,255,0.15)] md:max-h-[min(50dvh,28rem)]"
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="auto"
        aria-label={label}
        src={src}
      />
      <button
        type="button"
        onClick={toggleMute}
        aria-pressed={muted}
        className="absolute bottom-3 right-3 z-10 rounded-md border border-white/15 bg-black/60 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-white/85 backdrop-blur-sm hover:bg-black/75"
      >
        {muted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
}

/**
 * Primary landing (/) intro: uses `NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL` in production when set (Vercel Blob, etc.),
 * otherwise the animated PARABLE logo loop from `public/videos`. Centered, visible "player" between headline and CTA.
 */
export function LandingPageCenterVideo() {
  const reduceMotion = useReducedMotion();
  const intro = process.env.NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL?.trim();

  if (reduceMotion) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center py-6 min-h-0">
        <ParableLogoMark className="w-full" maxWidthClass="max-w-[min(22rem,88vw)]" />
      </div>
    );
  }

  if (intro && (intro.startsWith('https://') || intro.startsWith('http://'))) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center py-3 min-[400px]:py-6">
        <CenteredAutoplayFromUrl src={intro} label="Investor introduction" />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center py-3 min-[400px]:py-6">
      <ParableLogoVideo className="w-full" maxWidthClass="max-w-[min(90vw,36rem)]" />
    </div>
  );
}

export function ParableLogoVideo({
  className = '',
  maxWidthClass = 'max-w-md',
}: Props) {
  const reduceMotion = useReducedMotion();
  const { videoRef, muted, toggleMute } = useParableVideoAudio(PARABLE_LOGO_VIDEO_SRC);

  if (reduceMotion) {
    return (
      <ParableLogoMark className={className} maxWidthClass={maxWidthClass} />
    );
  }

  return (
    <div className={`relative mx-auto w-full min-w-0 overflow-hidden ${maxWidthClass} ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_80%_85%_at_50%_42%,rgba(0,242,255,0.2)_0%,rgba(18,22,32,0.92)_52%,#060708_100%)]"
        aria-hidden
      />
      <video
        ref={videoRef}
        className="relative box-border h-auto max-h-[min(55dvh,26rem)] w-full max-w-full object-contain object-center drop-shadow-[0_0_28px_rgba(0,242,255,0.4)] md:max-h-none"
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="auto"
        aria-label="PARABLE logo"
      >
        <source src={PARABLE_LOGO_VIDEO_MOBILE_SRC} type="video/mp4" media="(max-width: 767px)" />
        <source src={PARABLE_LOGO_VIDEO_SRC} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggleMute}
        aria-pressed={muted}
        className="absolute bottom-2 right-2 z-10 rounded-md border border-white/15 bg-black/60 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-white/85 backdrop-blur-sm hover:bg-black/75"
      >
        {muted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
}
