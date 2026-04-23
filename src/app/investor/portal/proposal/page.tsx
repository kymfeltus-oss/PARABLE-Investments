import type { Metadata } from 'next';
import { NdaGate } from '@/components/investor/NdaGate';
import { InvestorProposalRouteClient } from '@/components/investor/InvestorProposalRouteClient';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';

const canonical = new URL('/investor/portal/proposal', INVESTOR_SITE_URL);

export const metadata: Metadata = {
  title: 'Proposal overview | Investor Portal',
  description: 'Strategic presentation overview — then open the confidential Gamma proposal deck on a dedicated page.',
  alternates: { canonical: canonical.href },
  robots: { index: false, follow: false },
};

export default function InvestorPortalProposalPage() {
  return (
    <NdaGate>
      <InvestorProposalRouteClient />
    </NdaGate>
  );
}
