import type { Metadata } from 'next';
import { NdaGate } from '@/components/investor/NdaGate';
import { ExplorePrototypeBody } from '@/components/investor/ExplorePrototypeBody';

export const metadata: Metadata = {
  title: 'Explore prototype | Parable Investments',
  description: 'Interactive Parable app prototype for qualified investors.',
};

export default function ExplorePrototypePage() {
  const prototypeUrl = process.env.NEXT_PUBLIC_PARABLE_PROTOTYPE_URL?.trim() ?? '';
  return (
    <NdaGate>
      <ExplorePrototypeBody prototypeUrl={prototypeUrl} />
    </NdaGate>
  );
}
