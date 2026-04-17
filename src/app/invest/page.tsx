'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import HubBackground from '@/components/HubBackground';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';

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

type Sparkle = {
  id: number;
  left: string;
  top: string;
  delay: string;
};

/**
 * Investment proposal — cover only. Same palette & atmosphere as `/` flash, no ENTER / no redirect.
 */
export default function InvestCoverPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sparkles = useMemo<Sparkle[]>(() => {
    if (!mounted) return [];
    return Array.from({ length: 40 }).map((_, i) => {
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
  }, [mounted]);

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden p-6 md:p-10">
      <style>{sanctuaryStyles}</style>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <HubBackground />
        <div className="absolute inset-0 z-10">
          {mounted &&
            sparkles.map((s) => (
              <div
                key={s.id}
                className="absolute w-1 h-1 bg-[#00f2ff] rounded-full shadow-[0_0_8px_#00f2ff]"
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
            className="absolute bottom-[-2vh] left-[-20%] right-[-20%] h-[35vh] bg-[#00f2ff]/20 blur-[80px] rounded-[100%]"
            style={{ animation: 'fogDrift 12s ease-in-out infinite' }}
          />
        </div>
      </div>

      <motion.div
        className="relative z-20 flex flex-col items-center w-full max-w-lg md:max-w-2xl text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="mb-6 md:mb-8 space-y-2">
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.35em] text-[#00f2ff]/70">
            Confidential · Investment overview
          </p>
          <a
            href={INVESTOR_SITE_URL}
            className="inline-block text-[10px] md:text-[11px] font-semibold tracking-[0.2em] text-[#00f2ff]/90 hover:text-[#00f2ff] underline-offset-4 hover:underline"
          >
            parableinvestments.com
          </a>
        </div>

        <div className="relative w-full aspect-[3/1] mb-6 md:mb-10 max-w-md mx-auto">
          <Image
            src="/logo.svg"
            alt="Parable Protocol"
            fill
            className="object-contain drop-shadow-[0_0_30px_rgba(0,242,255,0.8)]"
            priority
          />
        </div>

        <p className="text-[2.5vw] md:text-sm font-black italic uppercase tracking-[0.35em] md:tracking-[0.4em] text-[#00f2ff] drop-shadow-[0_0_10px_#00f2ff] mb-8 md:mb-10">
          Streaming · Creating · Believing
        </p>

        <div className="w-full rounded-2xl border border-[#00f2ff]/25 bg-black/50 backdrop-blur-md px-6 py-8 md:px-10 md:py-10 shadow-[0_0_40px_rgba(0,242,255,0.08)]">
          <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight leading-snug">
            Faith-forward streaming &amp; creator infrastructure
          </h1>
          <p className="mt-4 text-sm md:text-[15px] text-white/55 leading-relaxed">
            Parable unites live ministry, testimonies, study tools, and community in one protocol-shaped
            experience—built for creators who serve audiences that care about depth, not just reach.
          </p>
          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-[#00f2ff]/35 to-transparent" />
          <dl className="mt-8 grid gap-4 text-left text-xs md:text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6 border-b border-white/10 pb-4">
              <dt className="font-black uppercase tracking-[0.2em] text-white/40">Document</dt>
              <dd className="text-white/80 mt-1 sm:mt-0">Series A overview — cover</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6 border-b border-white/10 pb-4">
              <dt className="font-black uppercase tracking-[0.2em] text-white/40">Prepared for</dt>
              <dd className="text-white/80 mt-1 sm:mt-0">[ Investor / firm name ]</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6">
              <dt className="font-black uppercase tracking-[0.2em] text-white/40">Version · Date</dt>
              <dd className="text-white/80 mt-1 sm:mt-0">0.1 · [ Month YYYY ]</dd>
            </div>
          </dl>
        </div>

        <p className="mt-10 text-[10px] md:text-[11px] text-white/30 uppercase tracking-[0.25em]">
          parableinvestments.com — internal &amp; investor use only
        </p>
      </motion.div>
    </div>
  );
}
