import { cn } from "@/lib/utils";

/**
 * Pitch Lock logo mark — the ONLY component that defines lock icon + wordmark.
 * Tokens: src/config/brand.ts · Styles: src/styles/brand.css (pl-logo-glow, pl-hero-*)
 * Sizes: sm | md | lg | hero · Layouts: inline | stacked
 */
type PitchLockLogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  layout?: "inline" | "stacked";
  showIcon?: boolean;
};

const sizeMap = {
  sm: { icon: 24, pitch: "text-lg", lock: "text-base", gap: "gap-2.5" },
  md: { icon: 32, pitch: "text-xl", lock: "text-lg", gap: "gap-2.5" },
  lg: { icon: 48, pitch: "text-3xl", lock: "text-2xl", gap: "gap-3" },
  hero: { icon: 96, pitch: "text-5xl sm:text-6xl md:text-7xl", lock: "text-3xl sm:text-4xl md:text-5xl", gap: "gap-6 sm:gap-8" },
};

function LockIcon({ size, hero }: { size: number; hero?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className={cn("shrink-0", hero && "pl-hero-lock-glow")}
    >
      {hero ? (
        <defs>
          <linearGradient id="pl-lock-stroke" x1="12" y1="12" x2="36" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--pl-cyan)" />
            <stop offset="1" stopColor="var(--pl-purple)" />
          </linearGradient>
          <radialGradient id="pl-lock-fill" cx="24" cy="28" r="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--pl-cyan)" stopOpacity="0.12" />
            <stop offset="1" stopColor="var(--pl-purple)" stopOpacity="0.04" />
          </radialGradient>
        </defs>
      ) : null}
      {hero ? (
        <>
          <circle cx="24" cy="28" r="18" fill="url(#pl-lock-fill)" opacity="0.9" />
          <path
            d="M24 14v6M20 18h8"
            stroke="var(--pl-cyan)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M24 10v2"
            stroke="var(--pl-purple)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </>
      ) : null}
      <rect
        x="12"
        y="20"
        width="24"
        height="20"
        rx="2"
        stroke={hero ? "url(#pl-lock-stroke)" : "var(--pl-text-secondary)"}
        strokeWidth={hero ? 2.5 : 2}
        fill={hero ? "var(--pl-surface-obsidian)" : "var(--pl-input-bg)"}
        fillOpacity={hero ? 0.85 : 1}
      />
      <path
        d="M18 20v-4a6 6 0 0112 0v4"
        stroke={hero ? "url(#pl-lock-stroke)" : "var(--pl-text-secondary)"}
        strokeWidth={hero ? 2.5 : 2}
        strokeLinecap="round"
      />
      <circle cx="24" cy="30" r="2.5" fill="var(--pl-cyan)" />
      <path d="M24 32.5v4" stroke="var(--pl-cyan)" strokeWidth="2" strokeLinecap="round" />
      {hero ? (
        <path
          d="M28 26l-4-4-4 4"
          stroke="var(--pl-purple)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      ) : null}
    </svg>
  );
}

export function PitchLockLogo({
  className,
  size = "md",
  layout = "inline",
  showIcon = true,
}: PitchLockLogoProps) {
  const s = sizeMap[size];
  const isHero = size === "hero";
  const isStacked = layout === "stacked" || isHero;

  return (
    <div
      className={cn(
        "inline-flex items-center pl-logo-glow",
        isStacked ? "flex-col" : "flex-row",
        s.gap,
        isHero && "pl-hero-logo",
        className
      )}
    >
      {showIcon ? <LockIcon size={s.icon} hero={isHero} /> : null}
      <span className="inline-flex items-baseline gap-2 sm:gap-3 leading-none">
        <span className={cn(s.pitch, "pl-brand tracking-wide pl-text")}>Pitch</span>
        <span className={cn(s.lock, "pl-heading", !isHero && "text-sm sm:text-base")}>Lock</span>
      </span>
    </div>
  );
}
