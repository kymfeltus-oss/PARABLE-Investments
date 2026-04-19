'use client';

type Props = {
  className?: string;
  /** Max width of the logo area (Tailwind class). */
  maxWidthClass?: string;
};

/**
 * Same asset and proportions as the main PARABLE app flash (`/public/logo.svg`).
 * Plain `<img>` keeps the SVG on the high-priority network path (Next/Image can defer SVG LCP).
 */
export function ParableLogoMark({ className = '', maxWidthClass = 'max-w-md' }: Props) {
  return (
    <div
      className={`relative mx-auto w-full min-w-0 max-w-full shrink aspect-[3/1] ${maxWidthClass} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG LCP: native img + fetchPriority beats next/image deferral */}
      <img
        src="/logo.svg"
        alt="Parable Protocol"
        width={900}
        height={300}
        decoding="async"
        loading="eager"
        fetchPriority="high"
        className="h-full w-full object-contain drop-shadow-[0_0_30px_rgba(0,242,255,0.8)]"
      />
    </div>
  );
}
