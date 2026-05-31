import Link from 'next/link';
import { InvestorIntroContent } from '@/components/investor/InvestorIntroContent';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';

export default function InfoPageBody() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white">
      <InvestorAtmosphere sparkleCount={12} />
      <div className="relative z-20 border-b border-[var(--cyan)]/10 px-4 py-8 md:px-8 md:py-10">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-4">
          <Link href="/start" className="parable-eyebrow hover:text-[var(--cyan)]">
            ← Choice hub
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--cyan)]/70 hover:text-[var(--cyan)]"
            >
              Welcome intro
            </Link>
            <Link href="/" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35 hover:text-white/55">
              Landing
            </Link>
          </div>
        </div>
      </div>
      <section className="relative z-20 px-4 pb-20 pt-4 md:px-8 md:pb-28 md:pt-8">
        <InvestorIntroContent />
      </section>
    </div>
  );
}
