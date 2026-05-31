import { Suspense } from 'react';
import { LegalGateClient } from '@/components/investor/LegalGateClient';

export default function InvestorLegalGatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-sm text-white/45">
          Loading…
        </div>
      }
    >
      <LegalGateClient />
    </Suspense>
  );
}
