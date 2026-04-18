'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { getInvestorNdaAccepted } from '@/lib/investor-nda-storage';

function subscribeNop() {
  return () => {};
}

/**
 * After legal gate: send users to /nda only if they have not already signed in this browser.
 */
export function InvestorHubContinueLink() {
  const ndaDone = useSyncExternalStore(
    subscribeNop,
    () => getInvestorNdaAccepted(),
    () => false
  );

  if (ndaDone) {
    return (
      <div className="flex justify-center" suppressHydrationWarning>
        <Link
          href="/start"
          className="rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 px-8 py-3.5 text-center text-sm font-black uppercase tracking-[0.2em] text-[#00f2ff] transition hover:bg-[#00f2ff]/20"
        >
          Continue to hub
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center" suppressHydrationWarning>
      <Link
        href="/nda?next=/start"
        className="rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 px-6 py-3.5 text-center text-sm font-black uppercase tracking-[0.2em] text-[#00f2ff] transition hover:bg-[#00f2ff]/20"
      >
        Continue to NDA
      </Link>
      <Link
        href="/start"
        className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.18em] text-white/75 transition hover:bg-white/10"
      >
        Skip to hub
      </Link>
    </div>
  );
}
