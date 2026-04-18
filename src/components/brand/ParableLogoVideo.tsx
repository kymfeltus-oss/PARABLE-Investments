'use client';

import { useCallback, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';

type Props = {
  className?: string;
  /** Max width of the logo area (Tailwind class). */
  maxWidthClass?: string;
};

/** Public path — file: `public/videos/PARABLE Logo.mp4` */
export const PARABLE_LOGO_VIDEO_SRC =
  '/videos/' + encodeURIComponent('PARABLE Logo.mp4');

/**
 * Full-viewport looping background for the investor landing (under sparkles + copy).
 * Starts muted for autoplay; user taps "Turn sound on" to unmute (browser policy).
 */
export function LandingHeroBackgroundVideo() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  const enableSound = useCallback(() => {
    setSoundOn(true);
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    void el.play().catch(() => {});
  }, []);

  if (reduceMotion) {
    return <div className="fixed inset-0 z-0 bg-[#070708]" aria-hidden />;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted={!soundOn}
        loop
        playsInline
        preload="auto"
        aria-label="PARABLE background"
      >
        <source src={PARABLE_LOGO_VIDEO_SRC} type="video/mp4" />
      </video>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/[0.18] to-black/50"
        aria-hidden
      />
      {!soundOn ? (
        <button
          type="button"
          onClick={enableSound}
          className="fixed bottom-[max(6.5rem,env(safe-area-inset-bottom))] left-4 z-[25] rounded-full border border-[#00f2ff]/35 bg-black/50 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#00f2ff] shadow-[0_0_24px_rgba(0,242,255,0.15)] backdrop-blur-md transition hover:border-[#00f2ff]/55 hover:bg-black/65 sm:left-6 sm:px-5 sm:text-[11px] md:bottom-40"
        >
          Turn sound on
        </button>
      ) : null}
    </div>
  );
}

/**
 * Inline animated logo (e.g. reduced-motion areas). Falls back to {@link ParableLogoMark}
 * when the user prefers reduced motion.
 */
export function ParableLogoVideo({
  className = '',
  maxWidthClass = 'max-w-md',
}: Props) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <ParableLogoMark className={className} maxWidthClass={maxWidthClass} />
    );
  }

  return (
    <div className={`relative mx-auto w-full ${maxWidthClass} ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_80%_85%_at_50%_42%,rgba(0,242,255,0.2)_0%,rgba(18,22,32,0.92)_52%,#060708_100%)]"
        aria-hidden
      />
      <video
        className="relative h-auto w-full object-contain mix-blend-lighten drop-shadow-[0_0_28px_rgba(0,242,255,0.4)]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="PARABLE logo"
      >
        <source src={PARABLE_LOGO_VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  );
}
