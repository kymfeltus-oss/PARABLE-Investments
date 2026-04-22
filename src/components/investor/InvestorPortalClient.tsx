'use client';

import { useEffect, useState } from 'react';

type Props = {
  clientIp: string;
  /** Read on the server each request so .env.local updates apply after refresh (no stale client inlining). */
  gammaProposalUrl: string;
};

export default function InvestorPortalClient({ clientIp, gammaProposalUrl }: Props) {
  const src = gammaProposalUrl.trim();
  const [isLoading, setIsLoading] = useState(Boolean(src));

  useEffect(() => {
    setIsLoading(Boolean(src));
  }, [src]);

  return (
    <div className="mx-auto w-full max-w-7xl bg-[#050505] px-4 py-8">
      <div className="relative w-full min-h-[85vh] overflow-hidden rounded-xl border border-cyan-500/10 shadow-[0_0_40px_rgba(0,255,255,0.1)]">
        {!src ? (
          <div className="flex min-h-[85vh] flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-sm font-medium text-white/80">Proposal embed not configured</p>
            <p className="max-w-md text-xs leading-relaxed text-white/45">
              Add{' '}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-cyan-400/90">
                NEXT_PUBLIC_GAMMA_PROPOSAL_URL=https://gamma.app/embed/…
              </code>{' '}
              to <code className="text-white/60">.env.local</code> in the project root, then restart{' '}
              <code className="text-white/60">npm run dev</code> and hard-refresh this page.
            </p>
          </div>
        ) : (
          <>
            <iframe
              key={src}
              src={src}
              className="relative z-0 block h-[85vh] min-h-[480px] w-full border-none"
              onLoad={() => setIsLoading(false)}
              allow="fullscreen; clipboard-write"
              allowFullScreen
              title="PROJECT PARABLE"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            {isLoading ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050505]">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400" />
                <p className="animate-pulse font-mono text-[10px] tracking-[0.3em] text-cyan-400">
                  DECRYPTING SOVEREIGN ARCHITECTURE…
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-cyan-500/10 pt-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
            Secure Infrastructure Environment
          </span>
          <span className="font-mono text-[10px] text-cyan-500/30">SESSION_ID: {clientIp || 'LOCAL_AUTH'}</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500/50">
          Authorization: Institutional Stealth Tier
        </span>
      </div>
    </div>
  );
}
