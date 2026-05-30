'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { LandingHeroBackgroundVideo } from '@/components/brand/ParableLogoVideo';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
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

  const goNext = useCallback(() => {
    router.push(continueHref);
  }, [router, continueHref]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext]);

  return (
    <div id="top" className="relative w-full bg-black text-white">
      <LandingHeroBackgroundVideo onEnded={goNext} />
      <InvestorAtmosphere overVideo />
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/35 via-transparent to-black/45"
        aria-hidden
      />

      <section
        className="relative z-20 min-h-[100dvh] min-h-screen overflow-hidden px-6 sm:px-8"
        aria-label="Investor introduction"
      >
        {/* Logo over the video “P”; copy sits directly beneath */}
        <div className="pointer-events-none absolute inset-x-0 top-[max(22vh,calc(env(safe-area-inset-top)+7.5rem))] flex flex-col items-center px-4 sm:top-[26vh] md:top-[28vh] lg:top-[30vh]">
          <ParableLogoMark
            aspectClass="aspect-auto"
            maxWidthClass="max-w-full"
            className="w-[min(13.5rem,46vw)] sm:w-[min(16rem,40vw)] md:w-[min(18rem,34vw)]"
          />
          <header className="mt-5 w-full max-w-3xl text-center sm:mt-6 md:mt-7">
            <p className="parable-landing-eyebrow mb-4 sm:mb-5">
              Confidential · Investor introduction
            </p>
            <div className="flex w-full justify-center px-2">
              <p className="parable-landing-tagline">
                Streaming&nbsp;·&nbsp;Creating&nbsp;·&nbsp;Believing
              </p>
            </div>
          </header>
        </div>
      </section>
    </div>
  );
}
