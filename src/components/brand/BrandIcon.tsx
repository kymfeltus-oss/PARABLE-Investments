import type { LucideIcon, LucideProps } from 'lucide-react';

type BrandIconTone = 'cyan' | 'purple' | 'gold' | 'inherit';

const TONE_CLASS: Record<BrandIconTone, string> = {
  cyan: 'icon-cyan',
  purple: 'icon-purple',
  gold: 'icon-gold',
  inherit: '',
};

export type BrandIconProps = LucideProps & {
  icon: LucideIcon;
  tone?: BrandIconTone;
};

/** Lucide icon with consistent PARABLE v2 glow tones. */
export function BrandIcon({
  icon: Icon,
  tone = 'cyan',
  className,
  'aria-hidden': ariaHidden = true,
  ...props
}: BrandIconProps) {
  const toneClass = TONE_CLASS[tone];
  const mergedClassName = [toneClass, className].filter(Boolean).join(' ');

  return <Icon className={mergedClassName || undefined} aria-hidden={ariaHidden} {...props} />;
}
