'use client';

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
 */
export function LandingHeroBackgroundVideo() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className="fixed inset-0 z-0 bg-[#070708]" aria-hidden />;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      >
        <source src={PARABLE_LOGO_VIDEO_SRC} type="video/mp4" />
      </video>
      {/* Readability for text + UI layered above */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55"
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
      {/* Plate behind the video so blend isn’t composited only against page black (Framer/motion stacking). */}
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
