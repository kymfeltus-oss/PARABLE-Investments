'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { buildPortalItems } from '@/components/investor/ParablePortalFeatures';
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

const channelRowClass =
  'group flex w-full items-start gap-3 rounded-xl border border-transparent bg-black/20 px-3 py-3.5 text-left transition hover:border-[#00f2ff]/25 hover:bg-[#00f2ff]/[0.06] sm:gap-4 sm:px-4 sm:py-4';

/**
 * Post–flash investor **operations hub**: dashboard layout (primary deck + channel rail), not a second “start” grid.
 */
export function InvestorPortalHub() {
  const meetHref = getInvestorScheduledMeetHref();
  const channels = buildPortalItems(meetHref);
  const reduceMotion = useReducedMotion();
  const trans = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="relative min-h-dvh w-full max-w-[100vw] overflow-x-hidden bg-[#030406] pb-14 pt-[max(0.75rem,env(safe-area-inset-top))] text-white sm:pb-20 sm:pt-[max(1rem,env(safe-area-inset-top))]">
      <div
        className="pointer-events-none fixed inset-0 z-[5] bg-[radial-gradient(ellipse_85%_50%_at_50%_-5%,rgba(0,242,255,0.1),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[6] bg-[radial-gradient(circle_at_0%_100%,rgba(0,242,255,0.05),transparent_45%)]"
        aria-hidden
      />
      <InvestorAtmosphere sparkleCount={36} />

      <div className="relative z-20 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:max-w-7xl lg:px-10">
        {/* Command chrome */}
        <motion.header
          className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4"
          initial={reduceMotion ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={trans}
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/start"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/[0.12] bg-black/50 px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#00f2ff]/85 backdrop-blur-sm transition hover:border-[#00f2ff]/35 hover:text-[#00f2ff] sm:text-[10px]"
            >
              <span aria-hidden>←</span> Home
            </Link>
            <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
            <ParableLogoMark
              maxWidthClass="max-w-[6.5rem] md:max-w-[7.5rem]"
              className="hidden opacity-90 sm:block"
            />
            <p className="min-w-0 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-[11px]">
              <span className="text-[#00f2ff]/80">Hub</span>
              <span className="mx-2 text-white/25" aria-hidden>
                ·
              </span>
              <span className="truncate">Confidential session</span>
            </p>
          </div>
          <Link
            href="/investor/portal/proposal?replayIntro=1"
            className="shrink-0 rounded-lg border border-white/[0.1] bg-black/40 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50 transition hover:border-[#00f2ff]/30 hover:text-[#00f2ff]/90 sm:text-[10px]"
          >
            Rewatch intro
          </Link>
        </motion.header>

        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Primary column */}
          <div className="lg:col-span-7 xl:col-span-8">
            <motion.div
              initial={reduceMotion ? false : fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...trans, delay: reduceMotion ? 0 : 0.05 }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#00f2ff]/30 bg-[#00f2ff]/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#00f2ff]">
                  NDA cleared
                </span>
                <span className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/45">
                  Embed-ready
                </span>
              </div>
              <h1 className="mt-4 text-balance font-black uppercase leading-tight tracking-[0.12em] text-white sm:tracking-[0.14em]">
                <span className="block text-[10px] font-mono font-bold tracking-[0.35em] text-[#00f2ff]/70">Operations</span>
                <span className="mt-2 block text-2xl text-[#00f2ff] drop-shadow-[0_0_24px_rgba(0,242,255,0.2)] sm:text-3xl md:text-4xl">
                  Investor control room
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/50 md:text-[15px]">
                You&apos;re inside the secure investor shell. Open the deck when you&apos;re ready, or use the channel rail
                for meetings, booking, models, product preview, and mail—without leaving this site.
              </p>
            </motion.div>

            <motion.div
              className="mt-8 lg:mt-10"
              initial={reduceMotion ? false : fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...trans, delay: reduceMotion ? 0 : 0.1 }}
            >
              <Link
                href="/investor/portal/proposal"
                className="group relative block overflow-hidden rounded-2xl border border-[#00f2ff]/30 bg-gradient-to-br from-[#061018]/95 via-black/90 to-black p-6 shadow-[0_0_0_1px_rgba(0,242,255,0.06)_inset,0_24px_80px_rgba(0,0,0,0.55)] transition hover:border-[#00f2ff]/50 hover:shadow-[0_0_48px_rgba(0,242,255,0.12)] sm:rounded-3xl sm:p-8 md:p-10"
              >
                <div
                  className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-[#00f2ff]/15 blur-3xl transition group-hover:bg-[#00f2ff]/22"
                  aria-hidden
                />
                <div className="absolute right-5 top-5 text-[#00f2ff]/45 transition group-hover:text-[#00f2ff]/75 sm:right-6 sm:top-6">
                  <DocIcon className="h-8 w-8 sm:h-9 sm:w-9" />
                </div>
                <span className="relative text-[10px] font-black uppercase tracking-[0.32em] text-[#00f2ff]/90">
                  Primary objective
                </span>
                <span className="relative mt-2 block text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
                  Strategic proposal deck
                </span>
                <span className="relative mt-3 block max-w-lg text-sm leading-relaxed text-white/50 md:text-[15px]">
                  Full-screen Gamma-class embed on this origin—your main diligence surface after clearance.
                </span>
                <span className="relative mt-6 inline-flex items-center gap-2 rounded-full border border-[#00f2ff]/40 bg-[#00f2ff]/15 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#00f2ff] transition group-hover:gap-3 sm:text-xs">
                  Open proposal <span aria-hidden>→</span>
                </span>
              </Link>
            </motion.div>

            <motion.p
              className="mt-6 text-[11px] leading-relaxed text-white/35 md:mt-8 md:text-xs"
              initial={reduceMotion ? false : fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ ...trans, delay: reduceMotion ? 0 : 0.14 }}
            >
              Need the public choice grid again?{' '}
              <Link href="/start" className="font-semibold text-[#00f2ff]/80 underline decoration-[#00f2ff]/25 underline-offset-4 hover:text-[#00f2ff]">
                Return to /start
              </Link>
              .
            </motion.p>
          </div>

          {/* Channel rail */}
          <motion.aside
            className="lg:col-span-5 xl:col-span-4"
            initial={reduceMotion ? false : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...trans, delay: reduceMotion ? 0 : 0.12 }}
            aria-labelledby="hub-channels-heading"
          >
            <div className="rounded-2xl border border-white/[0.1] bg-black/40 p-1 shadow-[0_0_40px_rgba(0,0,0,0.4)] backdrop-blur-md sm:rounded-3xl">
              <div className="border-b border-white/[0.06] px-4 py-3 sm:px-5 sm:py-3.5">
                <h2 id="hub-channels-heading" className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#00f2ff]/85">
                  Channels
                </h2>
                <p className="mt-1 text-[11px] leading-snug text-white/40">Live links—same order as your workflow.</p>
              </div>
              <ul className="divide-y divide-white/[0.06] px-1 py-1">
                {channels.map((item) => {
                  const label = item.id === 'portal' ? 'Welcome flash reel' : item.title;
                  const row = (
                    <>
                      <span className="mt-0.5 shrink-0 rounded-lg border border-[#00f2ff]/20 bg-[#00f2ff]/[0.07] p-2 text-[#00f2ff]/80 transition group-hover:border-[#00f2ff]/40 group-hover:text-[#00f2ff] [&_svg]:h-5 [&_svg]:w-5">
                        {item.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-bold tracking-tight text-white/95 sm:text-sm">{label}</span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-white/45 sm:text-[12px]">{item.body}</span>
                      </span>
                      <span className="shrink-0 pt-1 text-[#00f2ff]/50 transition group-hover:translate-x-0.5 group-hover:text-[#00f2ff]" aria-hidden>
                        →
                      </span>
                    </>
                  );
                  return (
                    <li key={item.id}>
                      {item.kind === 'mailto' ? (
                        <a href={item.href} className={channelRowClass}>
                          {row}
                        </a>
                      ) : (
                        <Link href={item.href} className={channelRowClass}>
                          {row}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.aside>
        </div>

        {/* Mobile-only compact mark */}
        <motion.div
          className="mt-10 flex justify-center sm:hidden"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...trans, delay: reduceMotion ? 0 : 0.18 }}
        >
          <ParableLogoMark className="w-full max-w-[10rem] opacity-80" />
        </motion.div>
      </div>
    </div>
  );
}
