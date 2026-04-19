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

/**
 * Fixed backdrop only (no video). Logo MP4 renders inline on the landing page so it scales
 * with the layout and sits above this layer + sparkles.
 */
export function LandingHeroBackgroundVideo() {
  return (
    <div className="fixed inset-0 z-0 bg-[#070708]" aria-hidden>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/[0.12] to-black/45"
        aria-hidden
      />
    </div>
  );
}

type InlineLogoProps = {
  className?: string;
  /** Caps video height so the full word fits on small viewports */
  maxHeightClass?: string;
};

/**
 * PARABLE logo MP4 in document flow (under eyebrow, tagline goes below). Full width,
 * object-contain so the entire word stays visible on phones.
 */
export function InvestorLandingInlineLogoVideo({
  className = '',
  maxHeightClass = 'max-h-[min(42vmin,52vw,22rem)] md:max-h-[min(48vmin,28rem)]',
}: InlineLogoProps) {
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

  if (reduceMotion) {
    return (
      <ParableLogoMark
        className={className}
        maxWidthClass="w-full max-w-[min(22rem,calc(100vw-2rem))] md:max-w-lg"
      />
    );
  }

  return (
    <div
      className={`relative mx-auto w-full max-w-[min(100%,36rem)] min-w-0 shrink-0 ${className}`}
    >
      <video
        ref={videoRef}
        className={`mx-auto h-auto w-full ${maxHeightClass} object-contain object-center mix-blend-lighten drop-shadow-[0_0_24px_rgba(0,242,255,0.35)]`}
        autoPlay
        muted={muted}
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
