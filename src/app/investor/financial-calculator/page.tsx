import type { Metadata } from 'next';
import Link from 'next/link';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';
import { SovereignYieldModeler } from '@/components/investor/SovereignYieldModeler';

const canonical = new URL('/investor/financial-calculator', INVESTOR_SITE_URL);

export const metadata: Metadata = {
  title: 'Financial calculator | Parable Investments',
  description: 'Sovereign yield modeler—infrastructure adoption and recovery sliders with implied NOI framing.',
  alternates: { canonical: canonical.href },
  robots: { index: false, follow: false },
};

export default function InvestorFinancialCalculatorPage() {
  return (
    <div className="relative min-h-dvh bg-[#050506] px-4 pb-16 pt-8 text-white sm:px-6 sm:pt-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/start"
          className="inline-flex items-center gap-2 rounded-full border border-[#00f2ff]/20 bg-black/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#00f2ff]/80 backdrop-blur-sm transition hover:border-[#00f2ff]/40 hover:bg-black/55 hover:text-[#00f2ff]"
        >
          <span aria-hidden>←</span> Back to hub
        </Link>
        <h1 className="mt-8 text-2xl font-black uppercase tracking-[0.12em] text-[#00f2ff] drop-shadow-[0_0_20px_rgba(0,242,255,0.18)] sm:text-3xl">
          Financial calculator
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/50">
          Adjust the sliders to explore implied gross infrastructure yield and net operating income framing. Figures are
          illustrative models—not investment advice.
        </p>
        <div className="mt-8">
          <SovereignYieldModeler />
        </div>
      </div>
    </div>
  );
}
