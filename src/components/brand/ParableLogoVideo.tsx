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
    <div
      className={`relative mx-auto w-full ${maxWidthClass} ${className}`}
    >
      <video
        className="h-auto w-full object-contain drop-shadow-[0_0_30px_rgba(0,242,255,0.55)]"
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
