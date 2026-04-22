import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { NdaGate } from '@/components/investor/NdaGate';
import { InvestorPortalView } from '@/components/investor/InvestorPortalView';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';
import { proposalEmbedUrlFromEnv } from '@/lib/proposal-embed';

export const dynamic = 'force-dynamic';

const canonical = new URL('/investor/portal/proposal', INVESTOR_SITE_URL);

export const metadata: Metadata = {
  title: 'Proposal deck | Investor Portal',
  description: 'Confidential strategic proposal — secured investor access.',
  alternates: { canonical: canonical.href },
  robots: { index: false, follow: false },
};

function clientIpFromHeaders(h: Headers): string {
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = h.get('x-real-ip')?.trim();
  if (real) return real;
  return '127.0.0.1';
}

export default async function InvestorPortalProposalPage() {
  const h = await headers();
  const clientIp = clientIpFromHeaders(h);
  const gammaProposalUrl = proposalEmbedUrlFromEnv();
  const onVercel = Boolean(process.env.VERCEL);
  return (
    <NdaGate>
      <div className="flex min-h-dvh flex-col">
        <div className="mx-auto w-full max-w-7xl px-4 pt-3">
          <Link
            href="/investor/portal"
            className="inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00f2ff]/75 hover:text-[#00f2ff]"
          >
            ← Welcome video
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
    </NdaGate>
  );
}
