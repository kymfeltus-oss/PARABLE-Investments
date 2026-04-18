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
 * Animated logo for hero / first screen. Falls back to {@link ParableLogoMark}
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
