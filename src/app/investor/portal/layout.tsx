import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';
import { proposalEmbedOriginFromEnv } from '@/lib/proposal-embed';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const canonical = new URL('/investor/portal', INVESTOR_SITE_URL);

export const metadata: Metadata = {
  title: 'Investor Portal | Project PARABLE',
  description: 'Welcome video, investor hub, then confidential strategic proposal — secured investor access.',
  alternates: { canonical: canonical.href },
  robots: { index: false, follow: false },
};

function PortalProposalResourceHints() {
  const origin = proposalEmbedOriginFromEnv();
  if (!origin) return null;
  return (
    <>
      <link rel="dns-prefetch" href={origin} data-proposal-embed={origin} />
      <link rel="preconnect" href={origin} crossOrigin="anonymous" data-proposal-embed={origin} />
    </>
  );
}

export default function InvestorPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.className} min-h-dvh w-full max-w-[100vw] overflow-x-hidden`}>
      <PortalProposalResourceHints />
      {children}
    </div>
  );
}
