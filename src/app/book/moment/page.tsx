import type { Metadata } from 'next';
import { NdaGate } from '@/components/investor/NdaGate';
import { BookMomentLanding } from '@/components/investor/BookMomentLanding';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';

const canonical = new URL('/book/moment', INVESTOR_SITE_URL);

export const metadata: Metadata = {
  title: 'The moment | Book a meeting',
  description: 'This is the moment we have been waiting for—schedule a conversation on your terms with Parable.',
  alternates: { canonical: canonical.href },
  robots: { index: false, follow: false },
};

export default function BookMomentPage() {
  return (
    <NdaGate>
      <BookMomentLanding />
    </NdaGate>
  );
}
