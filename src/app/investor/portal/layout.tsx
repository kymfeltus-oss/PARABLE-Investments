import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const canonical = new URL('/investor/portal', INVESTOR_SITE_URL);

export const metadata: Metadata = {
  title: 'Investor Portal | Project PARABLE',
  description: 'Confidential strategic proposal — secured investor access.',
  alternates: { canonical: canonical.href },
  robots: { index: false, follow: false },
};

export default function InvestorPortalLayout({ children }: { children: ReactNode }) {
  return <div className={`${inter.className} min-h-dvh`}>{children}</div>;
}
