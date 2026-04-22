import { headers } from 'next/headers';
import InvestorPortalClient from '@/components/investor/InvestorPortalClient';

export const dynamic = 'force-dynamic';

function clientIpFromHeaders(h: Headers): string {
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = h.get('x-real-ip')?.trim();
  if (real) return real;
  return '127.0.0.1';
}

export default async function InvestorPortalPage() {
  const h = await headers();
  const clientIp = clientIpFromHeaders(h);
  const gammaProposalUrl = process.env.NEXT_PUBLIC_GAMMA_PROPOSAL_URL?.trim() ?? '';
  const onVercel = Boolean(process.env.VERCEL);

  return (
    <>
      {process.env.NODE_ENV === 'development' ? (
        <div className="mx-auto max-w-7xl px-4 pt-4 font-mono text-[10px] text-amber-400/90">
          [dev] Server sees NEXT_PUBLIC_GAMMA_PROPOSAL_URL:{' '}
          {gammaProposalUrl
            ? `yes (${gammaProposalUrl.length} chars, starts ${gammaProposalUrl.slice(0, 32)}…)`
            : 'no — add to .env.local and restart npm run dev'}
        </div>
      ) : null}
      {onVercel && !gammaProposalUrl ? (
        <div className="mx-auto max-w-7xl px-4 pt-4 text-center text-[11px] leading-snug text-amber-200/95">
          This deployment has no <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_GAMMA_PROPOSAL_URL</code> on
          the server. Set it for <strong>Production</strong> in Vercel and redeploy.
        </div>
      ) : null}
      <InvestorPortalClient
        clientIp={clientIp}
        gammaProposalUrl={gammaProposalUrl}
        onVercel={onVercel}
      />
    </>
  );
}
