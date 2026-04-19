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

      <section className="relative z-20 flex min-h-[100dvh] min-h-screen flex-col overflow-hidden px-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
        <header className="shrink-0 pt-8 text-center">
          <p className="parable-landing-eyebrow mb-8">
            Confidential · Investor introduction
          </p>
          {/* Kept high on the page so it does not sit over the PARABLE hero in the video */}
          <div className="flex w-full justify-center px-2 pb-1">
            <p className="parable-landing-tagline">
              Streaming&nbsp;·&nbsp;Creating&nbsp;·&nbsp;Believing
            </p>
          </div>
        </header>

        {/* Middle: optional static logo; otherwise open space so hero PARABLE video stays unobstructed */}
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center px-0 pb-3 pt-4">
          {reduceMotion ? (
            <ParableLogoMark
              className="mt-0"
              maxWidthClass="max-w-[min(28rem,calc(100vw-2rem))]"
            />
          ) : null}
        </div>

        <footer className="shrink-0 flex flex-col items-center gap-10 pb-10">
          <motion.div
            className="flex w-full max-w-sm flex-col items-center"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.35em] text-white/40">
              Tap below or press Enter to continue
            </p>
            <Link
              href={continueHref}
              suppressHydrationWarning
              className="pointer-events-auto inline-block rounded-xl border border-[#00f2ff]/30 bg-black/40 px-6 py-2.5 shadow-[0_0_20px_rgba(0,242,255,0.1)] backdrop-blur-md transition hover:border-[#00f2ff]/50 hover:bg-black/55"
            >
              <span className="text-sm font-black tracking-[0.4em] text-[#00f2ff]">
                CONTINUE
              </span>
            </Link>
          </motion.div>

          <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#00f2ff]/45 to-transparent" />

          <a
            href={INVESTOR_SITE_URL}
            className="text-[11px] font-semibold tracking-[0.2em] text-[#00f2ff]/75 hover:text-[#00f2ff]"
          >
            parableinvestments.com
          </a>
        </footer>
      </section>
    </div>
  );
}
