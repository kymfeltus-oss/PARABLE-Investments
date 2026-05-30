import type { Metadata } from 'next';
import Link from 'next/link';
import { NdaGate } from '@/components/investor/NdaGate';
import { ParableInteractiveDemo } from '@/components/demo/ParableInteractiveDemo';

export const metadata: Metadata = {
  title: 'Interactive demo | Parable ERP',
  description:
    'On-site walkthrough: live tools, hybrid UX, studio & Shed, fellowship and Parable Money (demo only).',
};

export default function ParableDemoPage() {
  return (
    <NdaGate>
      <div className="relative min-h-screen bg-[#0A1018] text-white">
        <div
          className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0, 212, 255,0.1),transparent_50%)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-5xl px-5 pb-20 pt-10 sm:px-8 md:pt-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/parable-app-simulation"
              className="text-[10px] font-black uppercase tracking-[0.22em] text-[#00D4FF]/80 hover:text-[#00D4FF]"
            >
              Full app simulation
            </Link>
            <Link
              href="/explore"
              className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40 hover:text-white/65"
            >
              ← Embedded prototype
            </Link>
            <Link
              href="/start"
              className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40 hover:text-white/65"
            >
              Choice hub
            </Link>
          </div>
          <header className="mt-10 text-center md:mt-12">
            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[#00D4FF]/65">Five pillars</p>
            <h1 className="mt-3 text-balance text-2xl font-black uppercase tracking-[0.1em] text-[#00D4FF] sm:text-3xl">
              Parable pillar demo
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-white/55">
              Bottom nav maps to the five pillars: Live faith &amp; broadcast, hybrid surface, studio &amp; Shed, fellowship
              &amp; gatherings, and in-app economy. For the deployed consumer app, set{' '}
              <code className="rounded bg-white/10 px-1 font-mono text-[11px] text-[#00D4FF]/85">NEXT_PUBLIC_PARABLE_PROTOTYPE_URL</code> on{' '}
              <Link href="/explore" className="text-[#00D4FF]/90 underline decoration-[#00D4FF]/30 underline-offset-2 hover:text-[#00D4FF]">/explore</Link>.
            </p>
          </header>
          <div className="mt-10 md:mt-12">
            <ParableInteractiveDemo />
          </div>
        </div>
      </div>
    </NdaGate>
  );
}
