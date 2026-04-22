'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';
import type { IntroExitDetail } from '@/components/investor/InfoIntroVideoPage';
import { InfoIntroVideoPage } from '@/components/investor/InfoIntroVideoPage';
import { InvestorPortalView } from '@/components/investor/InvestorPortalView';

type Props = {
  clientIp: string;
  gammaProposalUrl: string;
  onVercel: boolean;
};

function InvestorProposalRouteClientInner({ clientIp, gammaProposalUrl, onVercel }: Props) {
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
        continueButtonLabel="Continue to proposal deck"
        onComplete={onIntroComplete}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-4 pt-3">
        <Link
          href="/investor/portal/hub"
          className="inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00f2ff]/75 hover:text-[#00f2ff]"
        >
          ← Investor hub
        </Link>
        <Link
          href="/investor/portal/proposal?replayIntro=1"
          className="inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 hover:text-[#00f2ff]/80"
        >
          Rewatch intro
        </Link>
      </div>
      {process.env.NODE_ENV === 'development' ? (
        <div className="mx-auto max-w-7xl px-4 pt-4 font-mono text-[10px] text-amber-400/90">
          [dev] Embed URL on server:{' '}
          {gammaProposalUrl
            ? `yes (${gammaProposalUrl.length} chars; first ${gammaProposalUrl.slice(0, 40)}…)`
            : 'no — set NEXT_PUBLIC_GAMMA_PROPOSAL_URL or GAMMA_EMBED_URL in .env.local and restart npm run dev'}
        </div>
      ) : null}
      {onVercel && !gammaProposalUrl ? (
        <div className="mx-auto max-w-7xl px-4 pt-4 text-center text-[11px] leading-snug text-amber-200/95">
          This deployment has no proposal embed URL. In Vercel add{' '}
          <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_GAMMA_PROPOSAL_URL</code> (full{' '}
          <code className="rounded bg-white/10 px-1">https://</code> iframe <code className="rounded bg-white/10 px-1">src</code>) or server-only{' '}
          <code className="rounded bg-white/10 px-1">GAMMA_EMBED_URL</code>. Enable for <strong>Production</strong> and{' '}
          <strong>Preview</strong> if you use preview deployments, then redeploy.
        </div>
      ) : null}
      <InvestorPortalView clientIp={clientIp} gammaProposalUrl={gammaProposalUrl} onVercel={onVercel} />
    </div>
  );
}

export function InvestorProposalRouteClient(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-black text-[11px] uppercase tracking-wider text-white/40">
          Loading…
        </div>
      }
    >
      <InvestorProposalRouteClientInner {...props} />
    </Suspense>
  );
}
