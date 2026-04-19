'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import {
  InvestorLandingInlineLogoVideo,
  LandingHeroBackgroundVideo,
} from '@/components/brand/ParableLogoVideo';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';
import { getInvestorNdaAccepted } from '@/lib/investor-nda-storage';

function subscribeNop() {
  return () => {};
}

export default function InvestorLandingPage() {
  const router = useRouter();
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

      <section className="relative z-20 flex min-h-[100dvh] min-h-screen flex-col overflow-hidden px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] md:px-8">
        <header className="shrink-0 pt-4 text-center md:pt-8">
          <p className="parable-landing-eyebrow mb-4 md:mb-5">
            Confidential · Investor introduction
          </p>
        </header>

        {/* PARABLE MP4 (or static mark) — inline so it scales to fit; tagline is strictly below */}
        <div className="flex w-full min-w-0 shrink-0 flex-col items-center justify-center px-0 py-2 md:py-4">
          <InvestorLandingInlineLogoVideo />
        </div>

        <div className="flex w-full shrink-0 justify-center px-2 pb-2 pt-3 md:pb-3 md:pt-4">
          <p className="parable-landing-tagline">
            Streaming&nbsp;·&nbsp;Creating&nbsp;·&nbsp;Believing
          </p>
        </div>

        <div className="min-h-0 w-full flex-1" aria-hidden />

        <footer className="shrink-0 flex flex-col items-center gap-10 pb-6 md:gap-10 md:pb-10">
          <motion.div
            className="flex w-full max-w-sm flex-col items-center"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 md:text-[10px] md:tracking-[0.35em]">
              Tap below or press Enter to continue
            </p>
            <Link
              href={continueHref}
              suppressHydrationWarning
              className="pointer-events-auto inline-block rounded-xl border border-[#00f2ff]/30 bg-black/40 px-10 py-4 shadow-[0_0_20px_rgba(0,242,255,0.1)] backdrop-blur-md transition hover:border-[#00f2ff]/50 hover:bg-black/55 md:px-6 md:py-2.5"
            >
              <span className="text-base font-black tracking-[0.35em] text-[#00f2ff] md:text-sm md:tracking-[0.4em]">
                CONTINUE
              </span>
            </Link>
          </motion.div>

          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#00f2ff]/45 to-transparent md:w-32" />

          <a
            href={INVESTOR_SITE_URL}
            className="text-[10px] font-semibold tracking-[0.2em] text-[#00f2ff]/75 hover:text-[#00f2ff] md:text-[11px]"
          >
            parableinvestments.com
          </a>
        </footer>
      </section>
    </div>
  );
}
