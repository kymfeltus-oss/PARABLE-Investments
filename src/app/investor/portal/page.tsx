import { headers } from 'next/headers';
import InvestorPortalClient from '@/components/investor/InvestorPortalClient';

export const dynamic = 'force-dynamic';

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

export default async function InvestorPortalPage() {
  const h = await headers();
  const clientIp = clientIpFromHeaders(h);
  const gammaProposalUrl = process.env.NEXT_PUBLIC_GAMMA_PROPOSAL_URL?.trim() ?? '';

  return <InvestorPortalClient clientIp={clientIp} gammaProposalUrl={gammaProposalUrl} />;
}
