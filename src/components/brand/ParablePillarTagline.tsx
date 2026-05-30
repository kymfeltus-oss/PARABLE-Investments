type Props = {
  className?: string;
  /** `bar` = STREAM | GIVE | … ; `dot` = middle dots (default) */
  separator?: 'dot' | 'bar';
  size?: 'sm' | 'md' | 'lg';
};

const PILLARS = [
  { label: 'Stream.', className: 'text-[#00D4FF]' },
  { label: 'Give.', className: 'text-[#A855F7]' },
  { label: 'Account.', className: 'text-[#1EA7FF]' },
  {
    label: 'Grow.',
    className: 'bg-gradient-to-r from-[#8B5CF6] to-[#FF4FD8] bg-clip-text text-transparent',
  },
] as const;

const sizeClass = {
  sm: 'text-[clamp(11px,2.8vmin,14px)] tracking-[0.22em]',
  md: 'text-[clamp(13px,3.2vmin,18px)] tracking-[0.28em]',
  lg: 'font-[family-name:var(--font-headline)] text-[clamp(15px,4.8vmin,2.35rem)] tracking-[clamp(0.12em,0.34em,0.34em)]',
} as const;

/**
 * Four product pillars — matches PARABLE vision deck (cyan / purple / azure / violet→pink).
 */
export function ParablePillarTagline({ className = '', separator = 'dot', size = 'md' }: Props) {
  const sep = separator === 'bar' ? '|' : '·';
  const sepClass = separator === 'bar' ? 'text-white/35 px-1' : 'text-white/40';

  return (
    <p
      className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-normal uppercase ${sizeClass[size]} ${className}`}
    >
      {PILLARS.map((p, i) => (
        <span key={p.label} className="inline-flex items-center">
          {i > 0 ? <span className={sepClass} aria-hidden>{sep}</span> : null}
          <span className={`font-normal ${p.className}`}>{p.label}</span>
        </span>
      ))}
    </p>
  );
}
