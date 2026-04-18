'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { LandingHeroBackgroundVideo } from '@/components/brand/ParableLogoVideo';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';
import { getInvestorNdaAccepted } from '@/lib/investor-nda-storage';

function subscribeNop() {
  return () => {};
}

export default function InvestorLandingPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const continueHref = useSyncExternalStore(
    subscribeNop,
    () => (getInvestorNdaAccepted() ? '/start' : '/nda?next=/start'),
    () => '/nda?next=/start'
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        router.push(getInvestorNdaAccepted() ? '/start' : '/nda?next=/start');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

  return (
    <div id="top" className="relative w-full bg-black text-white">
      <LandingHeroBackgroundVideo />
      <InvestorAtmosphere overVideo />

      <section className="relative z-20 flex min-h-[100dvh] min-h-screen flex-col overflow-hidden px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8">
        {/* Top: label only — breathing room from sound pill */}
        <header className="shrink-0 pt-6 text-center md:pt-10">
          <p className="parable-eyebrow">Confidential · Investor introduction</p>
        </header>

        {/* Center: optional static logo (reduced motion) + main lines — spaced, not stacked tight */}
        <div className="flex flex-1 flex-col items-center justify-center py-10 md:py-16">
          <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center md:max-w-2xl md:gap-10">
            {reduceMotion ? (
              <ParableLogoMark
                className="shrink-0"
                maxWidthClass="max-w-[min(20rem,85vw)] md:max-w-md"
              />
            ) : null}

            <div className="flex w-full flex-col gap-4 md:gap-5">
              <p className="text-base font-semibold leading-snug tracking-[0.12em] text-white/95 md:text-lg md:tracking-[0.14em]">
                Streaming · Creating · Believing
              </p>
              <p className="mx-auto max-w-md text-[10px] font-black uppercase leading-relaxed tracking-[0.32em] text-white/45 md:max-w-lg md:text-[11px] md:tracking-[0.36em]">
                Faith-forward streaming &amp; creator infrastructure
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: CTA block + divider + site link — own band so not crushed */}
        <footer className="shrink-0 flex flex-col items-center gap-10 pb-6 md:gap-12 md:pb-10">
          <motion.div
            className="flex w-full max-w-sm flex-col items-center gap-5"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45 md:text-[11px] md:tracking-[0.32em]">
              Tap below or press Enter to continue
            </p>
            <Link
              href={continueHref}
              suppressHydrationWarning
              className="pointer-events-auto inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-xl border border-[#00f2ff]/35 bg-black/45 px-10 py-3.5 text-center shadow-[0_0_24px_rgba(0,242,255,0.12)] backdrop-blur-md transition hover:border-[#00f2ff]/55 hover:bg-black/60 md:min-w-[220px] md:px-12 md:py-3"
            >
              <span className="text-sm font-black tracking-[0.32em] text-[#00f2ff] md:text-base md:tracking-[0.36em]">
                CONTINUE
              </span>
            </Link>
          </motion.div>

          <div className="h-px w-28 bg-gradient-to-r from-transparent via-[#00f2ff]/50 to-transparent md:w-36" />

          <a
            href={INVESTOR_SITE_URL}
            className="text-[11px] font-semibold tracking-[0.22em] text-[#00f2ff]/80 transition hover:text-[#00f2ff] md:text-xs"
          >
            parableinvestments.com
          </a>
        </footer>
      </section>
    </div>
  );
}
