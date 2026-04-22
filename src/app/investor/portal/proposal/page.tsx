import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { NdaGate } from '@/components/investor/NdaGate';
import { InvestorProposalRouteClient } from '@/components/investor/InvestorProposalRouteClient';
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
      <InvestorProposalRouteClient clientIp={clientIp} gammaProposalUrl={gammaProposalUrl} onVercel={onVercel} />
    </NdaGate>
  );
}
