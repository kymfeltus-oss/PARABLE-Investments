'use client';

import { useMemo } from 'react';

const sanctuaryStyles = `
  @keyframes floatUp { 
    0% { transform: translateY(0) scale(0); opacity: 0; } 
    50% { opacity: 1; transform: translateY(-40px) scale(1.1); } 
    100% { transform: translateY(-80px) scale(0); opacity: 0; } 
  }
`;

function frac(n: number) {
  return n - Math.floor(n);
}

function prand(seed: number) {
  return frac(Math.sin(seed * 9999.123) * 10000);
}

type Sparkle = { id: number; left: string; top: string; delay: string };

type Props = {
  /** When true, sits above a full-screen video (no glow beams, higher z-index). */
  overVideo?: boolean;
  /** Optional ambient sparkles — default 0 for v2 cinematic background. */
  sparkleCount?: number;
};

/**
 * Brand v2 page atmosphere: `.app-background` glow grid with optional light sparkles.
 * Do not stack with a separate `.app-background` wrapper on the same page.
 */
export function InvestorAtmosphere({ overVideo = false, sparkleCount = 0 }: Props) {
  const sparkles = useMemo<Sparkle[]>(() => {
    const n = Math.max(0, Math.min(48, Math.floor(sparkleCount)));
    return Array.from({ length: n }).map((_, i) => {
      const r1 = prand(i + 1);
      const r2 = prand(i + 101);
      const r3 = prand(i + 1001);
      return {
        id: i,
        left: `${(r1 * 100).toFixed(4)}%`,
        top: `${(r2 * 100).toFixed(4)}%`,
        delay: `${(r3 * 2.25).toFixed(4)}s`,
      };
    });
  }, [sparkleCount]);

  if (overVideo) {
    return (
      <div className="pointer-events-none fixed inset-0 z-[8] app-background-clean" aria-hidden />
    );
  }

  return (
    <>
      {sparkles.length > 0 ? <style>{sanctuaryStyles}</style> : null}
      <div className="pointer-events-none fixed inset-0 z-0 app-background" aria-hidden>
        {sparkles.length > 0 ? (
          <div className="absolute inset-0 z-10">
            {sparkles.map((s) => (
              <div
                key={s.id}
                className="absolute h-1 w-1 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_var(--cyan)]"
                style={{
                  left: s.left,
                  top: s.top,
                  animation: 'floatUp 4.5s ease-in-out infinite',
                  animationDelay: s.delay,
                  opacity: 0,
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
