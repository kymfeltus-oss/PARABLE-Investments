import { NdaGate } from '@/components/investor/NdaGate';
import { InfoIntroVideoPage } from '@/components/investor/InfoIntroVideoPage';

export const dynamic = 'force-dynamic';

export default function InvestorPortalPage() {
  return (
    <NdaGate>
      <InfoIntroVideoPage
        continueHref="/investor/portal/hub"
        continueButtonLabel="Enter investor hub"
      />
    </NdaGate>
  );
}
