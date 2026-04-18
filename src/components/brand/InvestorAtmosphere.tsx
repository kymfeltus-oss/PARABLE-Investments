'use client';

import { useMemo } from 'react';
import HubBackground from '@/components/HubBackground';

const sanctuaryStyles = `
  @keyframes floatUp { 
    0% { transform: translateY(0) scale(0); opacity: 0; } 
    50% { opacity: 1; transform: translateY(-40px) scale(1.1); } 
    100% { transform: translateY(-80px) scale(0); opacity: 0; } 
  }
  @keyframes fogDrift {
    0% { transform: translateX(-5%) translateY(0); opacity: 0.2; }
    50% { transform: translateX(5%) translateY(-10px); opacity: 0.4; }
    100% { transform: translateX(-5%) translateY(0); opacity: 0.2; }
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
  /** When true, sits above a full-screen video (transparent HubBackground, higher z-index). */
  overVideo?: boolean;
};

/**
 * Same layered background as the main app investor flash: HubBackground, sparkles, cyan fog.
 */
export function InvestorAtmosphere({ overVideo = false }: Props) {
  const sparkles = useMemo<Sparkle[]>(() => {
    return Array.from({ length: 96 }).map((_, i) => {
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
  }, []);

  return (
    <>
      <style>{sanctuaryStyles}</style>
      <div
        className={`fixed inset-0 pointer-events-none ${overVideo ? "z-[8]" : "z-0"}`}
      >
        <HubBackground variant={overVideo ? "overVideo" : "default"} />
        <div className="absolute inset-0 z-10">
          {sparkles.map((s) => (
            <div
              key={s.id}
              className="absolute w-1 h-1 rounded-full bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]"
              style={{
                left: s.left,
                top: s.top,
                animation: 'floatUp 4.5s ease-in-out infinite',
                animationDelay: s.delay,
                opacity: 0,
              }}
            />
          ))}
          <div
            className="absolute bottom-[-2vh] left-[-20%] right-[-20%] h-[35vh] rounded-[100%] bg-[#00f2ff]/20 blur-[80px]"
            style={{ animation: 'fogDrift 12s ease-in-out infinite' }}
          />
        </div>
      </div>
    </>
  );
}
