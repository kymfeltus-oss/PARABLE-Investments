import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';

const investUrl = new URL('/invest', INVESTOR_SITE_URL);

export const metadata: Metadata = {
  metadataBase: new URL(INVESTOR_SITE_URL),
  title: 'Parable — Investor overview',
  description: 'Confidential investment overview for Parable.',
  alternates: { canonical: investUrl.href },
  openGraph: {
    type: 'website',
    url: investUrl.href,
    siteName: 'Parable Investments',
    title: 'Parable — Investor overview',
    description: 'Confidential investment overview for Parable.',
  },
};

export default function InvestLayout({ children }: { children: ReactNode }) {
  return children;
}
