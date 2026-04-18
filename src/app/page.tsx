'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { INVESTOR_SITE_URL } from '@/lib/investor-site';

export default function InvestorLandingPage() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div id="top" className="relative w-full bg-black text-white">
      {/* —— Hero: mirrors main PARABLE flash (first screen) —— */}
      <section className="relative flex min-h-[100dvh] min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-10 md:py-12">
        <InvestorAtmosphere />

        <motion.div
          className="relative z-20 flex w-full max-w-lg flex-col items-center px-2 text-center md:max-w-2xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          <p className="parable-eyebrow mb-6 md:mb-8">Confidential · Investor introduction</p>

          <ParableLogoMark className="mb-6 md:mb-12" />

          <p className="parable-tagline mb-2 text-[2.5vw] md:text-base">
            Streaming · Creating · Believing
          </p>

          <p className="mb-8 max-w-sm text-[9px] font-black uppercase tracking-[0.35em] text-white/40 md:mb-10 md:text-[10px] md:tracking-[0.4em]">
            Faith-forward streaming &amp; creator infrastructure
          </p>

          <motion.div
            className="flex w-full max-w-sm flex-col items-center"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 md:text-[10px] md:tracking-[0.35em]">
              Tap, scroll, or press Enter to continue
            </p>
            <a
              href="#intro"
              className="pointer-events-auto inline-block rounded-xl border border-[#00f2ff]/30 bg-black/40 px-10 py-4 shadow-[0_0_20px_rgba(0,242,255,0.1)] backdrop-blur-md transition hover:border-[#00f2ff]/50 hover:bg-black/55 md:px-6 md:py-2.5"
            >
              <span className="text-base font-black tracking-[0.35em] text-[#00f2ff] md:text-sm md:tracking-[0.4em]">
                CONTINUE
              </span>
            </a>
          </motion.div>

          <div className="mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[#00f2ff]/45 to-transparent md:mt-14 md:w-32" />

          <a
            href={INVESTOR_SITE_URL}
            className="mt-8 text-[10px] font-semibold tracking-[0.2em] text-[#00f2ff]/75 hover:text-[#00f2ff] md:text-[11px]"
          >
            parableinvestments.com
          </a>
        </motion.div>
      </section>

      {/* —— Introduction: investment meeting context —— */}
      <section
        id="intro"
        className="relative z-20 border-t border-[#00f2ff]/15 bg-[#070708] px-4 pb-20 pt-12 md:px-8 md:pb-28 md:pt-16"
      >
        <div className="mx-auto max-w-2xl">
          <p className="parable-eyebrow mb-4 text-center">Introduction</p>
          <h2 className="mb-6 text-center text-lg font-semibold leading-snug tracking-tight text-white md:text-xl">
            Parable — purpose of this conversation
          </h2>
          <p className="mb-10 text-center text-sm leading-relaxed text-white/55 md:text-[15px]">
            This site is the entry point for a focused discussion with qualified investors about{' '}
            <span className="text-white/85">Parable</span>: a protocol-shaped platform where ministry, testimony,
            study, and live creation come together for audiences who want depth—not only scale.
          </p>

          <div className="parable-glass-panel mb-10 px-6 py-8 md:px-10 md:py-10">
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#00f2ff]/80">
              Objectives for this meeting
            </h3>
            <ul className="mt-5 space-y-3 text-left text-sm leading-relaxed text-white/60 md:text-[15px]">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00f2ff]" />
                Align on the problem: how faith communities and creators reach people in a streaming-first world.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00f2ff]" />
                Share what Parable is building—the product surface, community loop, and differentiation.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00f2ff]" />
                Outline the plan: milestones, capital needs, and how we measure progress.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00f2ff]" />
                Answer your questions and agree on next steps.
              </li>
            </ul>
          </div>

          <div className="parable-glass-panel mb-10 px-6 py-8 md:px-10 md:py-10">
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#00f2ff]/80">
              Confidentiality
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/50 md:text-[15px]">
              Materials shared in connection with this introduction are provided for evaluation only and are not an
              offer to sell securities. Please treat deck materials, metrics, and product plans as confidential unless
              we agree otherwise in writing.
            </p>
          </div>

          <div className="parable-glass-panel px-6 py-8 md:px-10 md:py-10">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00f2ff]/30 to-transparent" />
            <dl className="mt-8 grid gap-5 text-left text-xs md:text-sm">
              <div className="flex flex-col gap-1 border-b border-white/10 pb-5 sm:flex-row sm:justify-between sm:gap-6">
                <dt className="font-black uppercase tracking-[0.2em] text-white/40">Prepared for</dt>
                <dd className="text-white/85 sm:mt-0">[ Investor / firm name ]</dd>
              </div>
              <div className="flex flex-col gap-1 border-b border-white/10 pb-5 sm:flex-row sm:justify-between sm:gap-6">
                <dt className="font-black uppercase tracking-[0.2em] text-white/40">Session · Version</dt>
                <dd className="text-white/85 sm:mt-0">Introduction · 0.1</dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                <dt className="font-black uppercase tracking-[0.2em] text-white/40">Date</dt>
                <dd className="text-white/85 sm:mt-0">[ Month DD, YYYY ]</dd>
              </div>
            </dl>
          </div>

          <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
            <Link
              href="/meet"
              className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#00f2ff]/75 hover:text-[#00f2ff] md:text-[11px]"
            >
              Investor video room →
            </Link>
            <a
              href="#top"
              className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35 hover:text-white/55 md:text-[11px]"
            >
              ↑ Back to landing
            </a>
          </div>

          <p className="mt-14 text-center text-[10px] uppercase tracking-[0.25em] text-white/25 md:text-[11px]">
            parableinvestments.com — internal &amp; investor use only
          </p>
        </div>
      </section>
    </div>
  );
}
