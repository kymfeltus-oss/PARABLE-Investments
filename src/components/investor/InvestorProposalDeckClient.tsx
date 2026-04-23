'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { InvestorPortalView } from '@/components/investor/InvestorPortalView';
import { INVESTOR_FINANCIAL_CALCULATOR_PATH } from '@/lib/investor-site';

type Props = {
  clientIp: string;
  gammaProposalUrl: string;
  onVercel: boolean;
};

function InvestorProposalDeckClientInner({ clientIp, gammaProposalUrl, onVercel }: Props) {
  return (
    <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-[#030303]">
      <header className="flex w-full shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-white/10 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1">
          <Link
            href="/investor/portal/proposal/moment"
            className="inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00f2ff]/75 hover:text-[#00f2ff]"
          >
            ← The moment
          </Link>
          <Link
            href="/investor/portal/proposal"
            className="inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-[#00f2ff]/80"
          >
            Overview
          </Link>
          <Link
            href="/investor/portal/hub"
            className="inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-[#00f2ff]/80"
          >
            Hub
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-x-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
          <Link href="/investor/portal/proposal?replayIntro=1" className="hover:text-[#00f2ff]/80">
            Rewatch intro
          </Link>
          <Link href={INVESTOR_FINANCIAL_CALCULATOR_PATH} className="hover:text-[#00f2ff]/80">
            Calculator
          </Link>
        </div>
      </header>

      {process.env.NODE_ENV === 'development' ? (
        <div className="shrink-0 border-b border-white/5 px-3 py-1.5 font-mono text-[9px] text-amber-400/90 sm:px-4">
          [dev] embed:{' '}
          {gammaProposalUrl
            ? `yes (${gammaProposalUrl.length} ch; ${gammaProposalUrl.slice(0, 36)}…)`
            : 'no — set NEXT_PUBLIC_GAMMA_PROPOSAL_URL or GAMMA_EMBED_URL'}
        </div>
      ) : null}
      {onVercel && !gammaProposalUrl ? (
        <div className="shrink-0 border-b border-amber-500/20 bg-amber-950/20 px-3 py-2 text-center text-[10px] leading-snug text-amber-200/95 sm:px-4">
          No embed URL — add <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_GAMMA_PROPOSAL_URL</code> in Vercel and
          redeploy.
        </div>
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-0 sm:px-1 sm:pb-1">
        <InvestorPortalView
          clientIp={clientIp}
          gammaProposalUrl={gammaProposalUrl}
          onVercel={onVercel}
          deckImmersive
        />
      </div>
    </div>
  );
}

export function InvestorProposalDeckClient(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-black text-[11px] uppercase tracking-wider text-white/40">
          Loading…
        </div>
      }
    >
      <InvestorProposalDeckClientInner {...props} />
    </Suspense>
  );
}
