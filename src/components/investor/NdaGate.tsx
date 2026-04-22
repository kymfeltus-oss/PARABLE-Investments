'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getInvestorNdaAccepted } from '@/lib/investor-nda-storage';

type Props = {
  children: React.ReactNode;
};

/**
 * Client-only gate: redirects to `/nda` unless the user has accepted the NDA in this browser.
 * Reads `localStorage` only after mount so the first paint matches SSR (avoids hydration errors
 * from `useSyncExternalStore` where the client snapshot could differ from `getServerSnapshot`).
 */
export function NdaGate({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  /** `null` = not read yet (same on server + first client paint). */
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    queueMicrotask(() => setAllowed(getInvestorNdaAccepted()));
  }, []);

  useEffect(() => {
    if (allowed !== false) return;
    const next = pathname && pathname !== '/' ? pathname : '/start';
    router.replace(`/nda?next=${encodeURIComponent(next)}`);
  }, [allowed, router, pathname]);

  if (allowed !== true) {
    return (
      <div className="flex min-h-[100dvh] w-full max-w-[100vw] flex-col items-center justify-center bg-black px-6 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] text-center">
        <p className="text-sm text-white/50">Checking confidentiality agreement…</p>
      </div>
    );
  }

  return <>{children}</>;
}
