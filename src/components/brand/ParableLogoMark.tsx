'use client';

import { PARABLE_LOGO_ASSET_SRC } from '@/lib/parable-logo';

type Props = {
  className?: string;
  /** Max width of the logo area (Tailwind class). */
  maxWidthClass?: string;
  /** Tailwind aspect ratio on the wrapper (default wide wordmark box). */
  aspectClass?: string;
};

/**
 * PARABLE mark from `public/logo/PARABLE LOGO.SVG`.
 * Plain `<img>` keeps the asset on the high-priority network path (Next/Image can defer SVG LCP).
 */
export function ParableLogoMark({
  className = '',
  maxWidthClass = 'max-w-md',
  aspectClass = 'aspect-[3/1]',
}: Props) {
  const intrinsic = aspectClass === 'aspect-auto';
  return (
    <div
      className={`relative mx-auto w-full min-w-0 max-w-full shrink ${intrinsic ? '' : aspectClass} ${maxWidthClass} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- LCP: eager img + root preload */}
      <img
        src={PARABLE_LOGO_ASSET_SRC}
        alt="PARABLE"
        width={900}
        height={300}
        decoding="async"
        loading="eager"
        className={`w-full object-contain drop-shadow-[0_0_30px_rgba(0,212,255,0.75)] ${intrinsic ? 'h-auto' : 'h-full'}`}
      />
    </div>
  );
}
