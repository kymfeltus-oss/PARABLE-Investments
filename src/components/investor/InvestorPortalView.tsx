import { InvestorPortalClient } from '@/components/investor/InvestorPortalClient';

/**
 * Proposal deck shell: URL comes from env on the server; the iframe mounts via a client boundary
 * for priority loading + early preconnect on the embed origin.
 */
export function InvestorPortalView({
  clientIp,
  gammaProposalUrl,
  onVercel,
}: {
  clientIp: string;
  gammaProposalUrl: string;
  onVercel: boolean;
}) {
  const src = gammaProposalUrl.trim();

  return (
    <div className="mx-auto w-full max-w-7xl bg-[#050505] px-4 py-8">
      <div className="relative w-full min-h-[85vh] overflow-hidden rounded-xl border border-cyan-500/10 shadow-[0_0_40px_rgba(0,255,255,0.1)]">
        {!src ? (
          <div className="flex min-h-[85vh] flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-sm font-medium text-white/80">Proposal embed not configured</p>
            <p className="max-w-md text-xs leading-relaxed text-white/45">
              {onVercel ? (
                <>
                  In <strong className="text-white/70">Vercel</strong> → this project →{' '}
                  <strong className="text-white/70">Settings → Environment Variables</strong>, add{' '}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-cyan-400/90">
                    NEXT_PUBLIC_GAMMA_PROPOSAL_URL
                  </code>{' '}
                  (recommended) or <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-cyan-400/90">GAMMA_EMBED_URL</code>
                  . Value must be the full document URL (starts with <code className="text-white/55">https://</code>), same as
                  your embed iframe <code className="text-white/55">src</code> (white-label or Gamma Share → Embed). Enable it
                  for <strong className="text-white/70">Production</strong>, and for{' '}
                  <strong className="text-white/70">Preview</strong> if you test on preview URLs, then{' '}
                  <strong className="text-white/70">Redeploy</strong>.
                </>
              ) : (
                <>
                  Add{' '}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-cyan-400/90">
                    NEXT_PUBLIC_GAMMA_PROPOSAL_URL=https://yourproject.com/…
                  </code>{' '}
                  or <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-cyan-400/90">GAMMA_EMBED_URL</code> to{' '}
                  <code className="text-white/60">.env.local</code>, then restart <code className="text-white/60">npm run dev</code>.
                </>
              )}
            </p>
          </div>
        ) : (
          <InvestorPortalClient src={src} />
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
