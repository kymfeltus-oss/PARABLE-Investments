'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';
import type { IntroExitDetail } from '@/components/investor/InfoIntroVideoPage';
import { InfoIntroVideoPage } from '@/components/investor/InfoIntroVideoPage';
import { ProposalPresentationSection } from '@/components/investor/ProposalPresentationSection';
import { INVESTOR_FINANCIAL_CALCULATOR_PATH } from '@/lib/investor-site';

function InvestorProposalRouteClientInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const replayIntro = searchParams.get('replayIntro') === '1';
  const [introDismissed, setIntroDismissed] = useState(false);

  const showIntro = replayIntro || !introDismissed;

  const onIntroComplete = useCallback(
    (detail: IntroExitDetail) => {
      if (detail.via === 'video-ended') {
        router.push('/investor/portal/hub');
        return;
      }
      setIntroDismissed(true);
      if (replayIntro) {
        router.replace(pathname, { scroll: false });
      }
    },
    [replayIntro, router, pathname],
  );

  if (showIntro) {
    return (
      <InfoIntroVideoPage
        variant="intro"
        requireFullPlayOnce
        backHref="/investor/portal/hub"
        backLabel="← Investor hub"
        continueButtonLabel="Continue to proposal overview"
        onComplete={onIntroComplete}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-x-5 gap-y-2">
            <Link
              href="/investor/portal/hub"
              className="inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00f2ff]/75 hover:text-[#00f2ff]"
            >
              ← Investor hub
            </Link>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <Link
                href="/investor/portal/proposal?replayIntro=1"
                className="inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-[#00f2ff]/80"
              >
                Rewatch intro
              </Link>
              <Link
                href={INVESTOR_FINANCIAL_CALCULATOR_PATH}
                className="inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-[#00f2ff]/80"
              >
                Financial calculator
              </Link>
            </div>
          </div>
          <div className="w-full sm:flex sm:justify-end">
            <Link
              href="/investor/portal/proposal/deck"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#00f2ff] py-3.5 text-center text-sm shadow-[0_0_32px_rgba(0,242,255,0.22)] transition hover:brightness-105 sm:w-auto sm:min-w-[16rem] sm:px-8"
            >
              <span className="text-base font-extralight text-black/45" aria-hidden>
                →
              </span>
              <span className="font-black tracking-[0.22em] text-black">PROPOSAL</span>
            </Link>
          </div>
        </div>
      </div>
      <ProposalPresentationSection />
    </div>
  );
}

export function InvestorProposalRouteClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-black text-[11px] uppercase tracking-wider text-white/40">
          Loading…
        </div>
      }
    >
      <InvestorProposalRouteClientInner />
    </Suspense>
  );
}
