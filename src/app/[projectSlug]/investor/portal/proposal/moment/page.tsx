import type { Metadata } from 'next';
import { NdaGate } from '@/components/investor/NdaGate';
import { ProposalDeckMomentLanding } from '@/components/investor/ProposalDeckMomentLanding';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';

const canonical = new URL('/investor/portal/proposal/moment', INVESTOR_SITE_URL);

export const metadata: Metadata = {
  title: 'The moment | Strategic proposal | Investor Portal',
  description: 'This is the moment we have been waiting for — then open the full-screen confidential proposal deck.',
  alternates: { canonical: canonical.href },
  robots: { index: false, follow: false },
};

export default function ProposalMomentPage() {
  return (
    <NdaGate>
      <ProposalDeckMomentLanding />
    </NdaGate>
  );
}
