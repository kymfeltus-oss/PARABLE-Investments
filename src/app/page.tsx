'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoVideo } from '@/components/brand/ParableLogoVideo';
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
      <section className="relative flex min-h-[100dvh] min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-10 md:py-12">
        <InvestorAtmosphere />

        <motion.div
          className="relative z-20 flex w-full max-w-lg flex-col items-center px-2 text-center md:max-w-2xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          <p className="parable-eyebrow mb-6 md:mb-8">Confidential · Investor introduction</p>

          <ParableLogoVideo className="mb-6 md:mb-12" />

          <p className="parable-tagline mb-2 text-[2.5vw] md:text-base">
            Streaming · Creating · Believing
          </p>

          <p className="mb-8 max-w-sm text-[9px] font-black uppercase tracking-[0.35em] text-white/40 md:mb-10 md:text-[10px] md:tracking-[0.4em]">
            Faith-forward streaming &amp; creator infrastructure
          </p>

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

          <div className="mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[#00f2ff]/45 to-transparent md:mt-14 md:w-32" />

          <a
            href={INVESTOR_SITE_URL}
            className="mt-8 text-[10px] font-semibold tracking-[0.2em] text-[#00f2ff]/75 hover:text-[#00f2ff] md:text-[11px]"
          >
            parableinvestments.com
          </a>
        </motion.div>
      </section>
    </div>
  );
}
