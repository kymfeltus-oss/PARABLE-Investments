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
    <div className="flex min-h-dvh flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 border-b border-white/10 px-4 pb-3 pt-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href="/investor/portal/proposal"
            className="inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00f2ff]/75 hover:text-[#00f2ff]"
          >
            ← Proposal overview
          </Link>
          <Link
            href="/investor/portal/hub"
            className="inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-[#00f2ff]/80"
          >
            Investor hub
          </Link>
        </div>
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

      {process.env.NODE_ENV === 'development' ? (
        <div className="mx-auto w-full max-w-7xl px-4 pt-3 font-mono text-[10px] text-amber-400/90">
          [dev] Embed URL on server:{' '}
          {gammaProposalUrl
            ? `yes (${gammaProposalUrl.length} chars; first ${gammaProposalUrl.slice(0, 40)}…)`
            : 'no — set NEXT_PUBLIC_GAMMA_PROPOSAL_URL or GAMMA_EMBED_URL in .env.local and restart npm run dev'}
        </div>
      ) : null}
      {onVercel && !gammaProposalUrl ? (
        <div className="mx-auto w-full max-w-7xl px-4 pt-3 text-center text-[11px] leading-snug text-amber-200/95">
          This deployment has no proposal embed URL. In Vercel add{' '}
          <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_GAMMA_PROPOSAL_URL</code> (full{' '}
          <code className="rounded bg-white/10 px-1">https://</code> iframe <code className="rounded bg-white/10 px-1">src</code>) or
          server-only <code className="rounded bg-white/10 px-1">GAMMA_EMBED_URL</code>. Enable for <strong>Production</strong> and{' '}
          <strong>Preview</strong> if you use preview deployments, then redeploy.
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-7xl flex-1 px-4">
        <InvestorPortalView clientIp={clientIp} gammaProposalUrl={gammaProposalUrl} onVercel={onVercel} />
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
