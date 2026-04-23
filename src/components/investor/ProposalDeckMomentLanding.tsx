'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { hrefWithFromProposal } from '@/lib/proposal-deck-return';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1473163928189-36b6190f2f88?auto=format&fit=crop&w=2000&q=80';

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

/**
 * Pre-deck “moment” for investors — then {@link /investor/portal/proposal/deck} fills the screen with Gamma.
 */
export function ProposalDeckMomentLanding() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-black text-white">
      <InvestorAtmosphere sparkleCount={64} />
      <div
        className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,242,255,0.07)_0%,transparent_55%,rgba(0,0,0,0.92)_100%)]"
        aria-hidden
      />

      <div className="relative z-20 mx-auto flex w-full max-w-5xl flex-col px-4 py-8 pb-16 md:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.2em]">
          <Link href="/investor/portal/proposal" className="text-[#00f2ff]/80 transition hover:text-[#00f2ff]">
            ← Proposal overview
          </Link>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/45">
            <Link href="/investor/portal/hub" className="hover:text-[#00f2ff]/85">
              Investor hub
            </Link>
            <span className="text-white/20" aria-hidden>
              ·
            </span>
            <span className="text-[#00f2ff]/70">Confidential deck</span>
          </div>
        </div>

        <motion.header
          initial={fade.initial}
          animate={fade.animate}
          transition={fade.transition}
          className="text-center"
        >
          <p className="parable-eyebrow text-[#00f2ff]/90">The strategic story</p>
        </motion.header>

        <motion.div
          initial={fade.initial}
          animate={fade.animate}
          transition={{ ...fade.transition, delay: 0.05 }}
          className="relative mx-auto mt-6 w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30 shadow-[0_0_80px_rgba(0,242,255,0.1)]"
        >
          <div className="relative min-h-[min(52vh,28rem)] w-full sm:min-h-[32rem]">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              className="object-cover object-center opacity-55"
              priority
              sizes="(max-width: 64rem) 100vw, 64rem"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/95"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,242,255,0.12)_0%,transparent_55%)]"
              aria-hidden
            />
            <div className="relative z-10 flex min-h-[min(52vh,28rem)] flex-col justify-end px-5 py-8 text-left sm:min-h-[32rem] sm:px-10 sm:py-12 md:justify-center md:py-14">
              <ParableLogoMark className="mb-4 max-w-[9rem] opacity-95 sm:mb-5 sm:max-w-[11rem]" maxWidthClass="max-w-full" />
              <p className="font-serif text-sm italic tracking-wide text-white/75 sm:text-base">
                Streaming. Creating. Believing.
              </p>
              <h1 className="mt-4 text-balance font-black uppercase leading-[1.02] tracking-[0.06em] sm:tracking-[0.08em]">
                <span className="block text-2xl text-white/95 sm:text-4xl md:text-5xl">This is the moment</span>
                <span className="mt-1 block max-w-4xl bg-gradient-to-b from-white via-[#c4fffe] to-[#00f2ff] bg-clip-text text-3xl text-transparent sm:mt-2 sm:text-5xl md:text-6xl">
                  we&apos;ve been waiting for
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/65 sm:mt-5 sm:text-base md:max-w-2xl">
                The next screen is your full-screen confidential proposal. Scroll, present, and explore on your
                terms—this is the same deck we have linked in Gamma, now embedded in a Parable-secured view.
              </p>
              <div className="mt-7 flex w-full max-w-2xl flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="/investor/portal/proposal/deck"
                  className="inline-flex w-full min-w-0 items-center justify-center gap-2.5 rounded-xl bg-[#00f2ff] px-6 py-3.5 text-sm shadow-[0_0_32px_rgba(0,242,255,0.35)] transition hover:brightness-105 sm:w-auto sm:px-8 sm:py-4"
                >
                  <span className="text-base font-extralight text-black/45" aria-hidden>
                    →
                  </span>
                  <span className="font-black tracking-[0.22em] text-black">PROPOSAL</span>
                </Link>
                <Link
                  href={hrefWithFromProposal('/book/moment', true)}
                  className="inline-flex w-full min-w-0 items-center justify-center rounded-xl border border-[#00f2ff]/45 bg-black/30 px-6 py-3.5 text-sm font-bold tracking-tight text-[#00f2ff] transition hover:border-[#00f2ff]/80 hover:bg-[#00f2ff]/5 sm:w-auto sm:px-8 sm:py-4"
                >
                  Book a meeting
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 text-center text-xs text-white/35"
        >
          Prefer the overview?{' '}
          <Link href="/investor/portal/proposal" className="text-[#00f2ff]/60 hover:text-[#00f2ff]">
            Return to proposal overview
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
