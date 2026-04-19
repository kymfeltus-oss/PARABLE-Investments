'use client';

import { useEffect, useRef, useState } from 'react';
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

/** Portrait / mobile hero — file: `public/videos/PARABLE Mobile logo.mp4` */
export const PARABLE_LOGO_VIDEO_MOBILE_SRC =
  '/videos/' + encodeURIComponent('PARABLE Mobile logo.mp4');

/**
 * Full-viewport looping background for the investor landing (under sparkles + copy).
 * Starts muted so autoplay succeeds; unmutes on first user gesture (tap/click/key).
 * Mobile: `PARABLE Mobile logo.mp4` + `object-contain` so the full frame fits (logo not blown up).
 * md+: `PARABLE Logo.mp4` + `object-cover` for full-bleed hero.
 */
export function LandingHeroBackgroundVideo() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

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
      void el.play().catch(() => {});
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (reduceMotion) {
    return <div className="fixed inset-0 z-0 bg-[#070708]" aria-hidden />;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full bg-[#070708] object-contain object-center md:object-cover"
          autoPlay
          muted={muted}
          loop
          playsInline
          preload="auto"
          aria-label="PARABLE background"
        >
          <source
            src={PARABLE_LOGO_VIDEO_MOBILE_SRC}
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source src={PARABLE_LOGO_VIDEO_SRC} type="video/mp4" />
        </video>
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/[0.18] to-black/50"
        aria-hidden
      />
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
