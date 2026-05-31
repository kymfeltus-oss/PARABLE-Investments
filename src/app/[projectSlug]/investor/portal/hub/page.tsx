import type { Metadata } from 'next';
import { NdaGate } from '@/components/investor/NdaGate';
import { InvestorPortalHub } from '@/components/investor/InvestorPortalHub';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';

export const dynamic = 'force-dynamic';

const canonical = new URL('/investor/portal/hub', INVESTOR_SITE_URL);

export const metadata: Metadata = {
  title: 'Investor hub | Project PARABLE',
  description: 'Confidential investor hub—proposal deck, meetings, calculator, and app preview.',
  alternates: { canonical: canonical.href },
  robots: { index: false, follow: false },
};

export default function InvestorPortalHubPage() {
  return (
    <NdaGate>
      <InvestorPortalHub />
    </NdaGate>
  );
}
