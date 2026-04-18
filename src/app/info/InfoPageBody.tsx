import Link from 'next/link';
import { InvestorIntroContent } from '@/components/investor/InvestorIntroContent';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { InfoVideoIntro } from '@/components/investor/InfoVideoIntro';

export default function InfoPageBody() {
  return (
    <InfoVideoIntro>
      <div className="relative min-h-screen w-full bg-[#070708] text-white">
        <div className="pointer-events-none fixed inset-0 opacity-40">
          <InvestorAtmosphere />
        </div>
        <div className="relative z-20 border-b border-[#00f2ff]/10 px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-4">
            <Link href="/start" className="parable-eyebrow hover:text-[#00f2ff]">
              ← Choice hub
            </Link>
            <Link href="/" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35 hover:text-white/55">
              Landing
            </Link>
          </div>
        </div>
        <section className="relative z-20 px-4 pb-20 pt-4 md:px-8 md:pb-28 md:pt-8">
          <InvestorIntroContent />
        </section>
      </div>
    </InfoVideoIntro>
  );
}
