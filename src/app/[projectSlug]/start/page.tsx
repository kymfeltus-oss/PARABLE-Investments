import { NdaGate } from '@/components/investor/NdaGate';
import StartPageBody from './StartPageBody';

/** Hub copy changes often; avoid stale CDN/static shells after deploy. */
export const dynamic = 'force-dynamic';

export default function InvestorStartPage() {
  return (
    <NdaGate>
      <StartPageBody />
    </NdaGate>
  );
}
