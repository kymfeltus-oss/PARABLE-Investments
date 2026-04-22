'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getInvestorNdaAccepted } from '@/lib/investor-nda-storage';

type Props = {
  children: React.ReactNode;
};

function subscribe() {
  return () => {};
}

/**
 * Client-only gate: redirects to `/nda` unless the user has accepted the NDA in this browser.
 */
export function NdaGate({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const allowed = useSyncExternalStore(subscribe, getInvestorNdaAccepted, () => false);

  useEffect(() => {
    if (allowed) return;
    const next = pathname && pathname !== '/' ? pathname : '/start';
    router.replace(`/nda?next=${encodeURIComponent(next)}`);
  }, [allowed, router, pathname]);

  if (!allowed) {
    return (
      <div className="flex min-h-[100dvh] w-full max-w-[100vw] flex-col items-center justify-center bg-black px-6 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] text-center">
        <p className="text-sm text-white/50">Checking confidentiality agreement…</p>
      </div>
    );
  }

  return <>{children}</>;
}
