'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { ParablePortalFeatures } from '@/components/investor/ParablePortalFeatures';
import { getInvestorScheduledMeetHref } from '@/lib/meeting-links';

function DocIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

/**
 * Post–welcome-video investor hub: shortcuts + primary path to the proposal deck.
 */
export function InvestorPortalHub() {
  const meetHref = getInvestorScheduledMeetHref();
  const reduceMotion = useReducedMotion();
  const trans = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="relative min-h-dvh w-full max-w-[100vw] overflow-x-hidden bg-[#050506] pb-12 pt-[max(0.75rem,env(safe-area-inset-top))] text-white sm:pb-16 sm:pt-[max(1rem,env(safe-area-inset-top))]">
      <div
        className="pointer-events-none fixed inset-0 z-[5] bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(0,242,255,0.12),transparent_55%)]"
        aria-hidden
      />
      <InvestorAtmosphere sparkleCount={28} />

      <div className="relative z-20 mx-auto flex w-full max-w-2xl flex-col px-5 sm:px-8 md:px-10">
        <motion.div
          className="flex flex-wrap items-center justify-between gap-3"
          initial={reduceMotion ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={trans}
        >
          <Link
            href="/start"
            className="inline-flex items-center gap-2 rounded-full border border-[#00f2ff]/20 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#00f2ff]/80 backdrop-blur-sm transition hover:border-[#00f2ff]/40 hover:text-[#00f2ff] sm:px-4"
          >
            <span aria-hidden>←</span> Choice hub
          </Link>
          <Link
            href="/investor/portal"
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 transition hover:text-[#00f2ff]/85"
          >
            Rewatch intro
          </Link>
        </motion.div>

        <motion.div
          className="relative mt-8 flex justify-center sm:mt-10"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...trans, delay: reduceMotion ? 0 : 0.04 }}
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10 scale-110 blur-3xl"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,242,255,0.18) 0%, transparent 68%)',
            }}
            aria-hidden
          />
          <ParableLogoMark className="relative w-full max-w-[min(17rem,82vw)] opacity-95 sm:max-w-xs" />
        </motion.div>

        <motion.div
          className="mt-8 text-center sm:mt-10"
          initial={reduceMotion ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...trans, delay: reduceMotion ? 0 : 0.1 }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.36em] text-[#00f2ff]/65">Investor hub</p>
          <h1 className="mt-3 text-balance text-2xl font-black uppercase leading-tight tracking-[0.1em] text-[#00f2ff] drop-shadow-[0_0_22px_rgba(0,242,255,0.18)] sm:text-3xl sm:tracking-[0.14em]">
            Project PARABLE
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-sm leading-relaxed text-white/52 sm:text-[15px]">
            You&apos;re past the intro. Open the proposal deck or jump to meetings, the financial modeler, and the app
            preview—everything stays on this confidential site.
          </p>
        </motion.div>

        <motion.div
          className="mt-8 sm:mt-10"
          initial={reduceMotion ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...trans, delay: reduceMotion ? 0 : 0.14 }}
        >
          <ParablePortalFeatures variant="compact" meetHref={meetHref} />
        </motion.div>

        <motion.div
          className="mt-8 sm:mt-10"
          initial={reduceMotion ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...trans, delay: reduceMotion ? 0 : 0.18 }}
        >
          <Link
            href="/investor/portal/proposal"
            className="parable-glass-panel group relative block overflow-hidden px-6 py-7 transition hover:-translate-y-0.5 hover:border-[#00f2ff]/50 hover:shadow-[0_0_40px_rgba(0,242,255,0.14)] sm:px-8 sm:py-8"
          >
            <div className="absolute right-5 top-5 text-[#00f2ff]/40 transition group-hover:text-[#00f2ff]/70">
              <DocIcon className="h-7 w-7" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.32em] text-[#00f2ff]/90">Proposal</span>
            <span className="mt-2 block text-lg font-bold tracking-tight text-white sm:text-xl">
              Open strategic proposal deck
            </span>
            <span className="mt-2 block max-w-md text-sm leading-relaxed text-white/50">
              Full-screen embedded deck—the same experience as your Gamma share link, hosted here after NDA clearance.
            </span>
            <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f2ff] transition group-hover:gap-3">
              Open proposal <span aria-hidden>→</span>
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
