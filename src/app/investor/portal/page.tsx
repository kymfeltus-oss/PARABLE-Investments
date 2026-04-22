import { headers } from 'next/headers';
import { InvestorPortalClient } from '@/components/investor/InvestorPortalClient';

export const dynamic = 'force-dynamic';

function clientIpFromHeaders(h: Headers): string {
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = h.get('x-real-ip')?.trim();
  if (real) return real;
  return 'Unavailable';
}

export default async function InvestorPortalPage() {
  const h = await headers();
  const clientIp = clientIpFromHeaders(h);

  return <InvestorPortalClient clientIp={clientIp} />;
}
