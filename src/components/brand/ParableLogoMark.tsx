'use client';

import Image from 'next/image';

type Props = {
  className?: string;
  /** Max width of the logo area (Tailwind class). */
  maxWidthClass?: string;
};

/**
 * Same asset and proportions as the main PARABLE app flash (`/public/logo.svg`).
 */
export function ParableLogoMark({ className = '', maxWidthClass = 'max-w-md' }: Props) {
  return (
    <div className={`relative mx-auto w-full aspect-[3/1] ${maxWidthClass} ${className}`}>
      <Image
        src="/logo.svg"
        alt="Parable Protocol"
        fill
        className="object-contain drop-shadow-[0_0_30px_rgba(0,242,255,0.8)]"
        priority
      />
    </div>
  );
}
