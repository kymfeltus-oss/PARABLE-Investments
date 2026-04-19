'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { RequestMeetingBlock } from '@/components/investor/RequestMeetingBlock';

function scheduledMeetHref(): string {
  const suffix = process.env.NEXT_PUBLIC_SCHEDULED_MEET_ROOM_SUFFIX?.trim();
  if (suffix) {
    return `/meet?join=scheduled&room=${encodeURIComponent(suffix)}`;
  }
  return '/meet?join=scheduled';
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function StartPageBody() {
  const meetHref = scheduledMeetHref();
  const reduceMotion = useReducedMotion();
  const trans = reduceMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050506] text-white">
      <div
        className="pointer-events-none fixed inset-0 z-[5] bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,rgba(0,242,255,0.14),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[6] bg-[radial-gradient(circle_at_80%_90%,rgba(0,242,255,0.06),transparent_45%)]"
        aria-hidden
      />
      <InvestorAtmosphere />

      <div className="relative z-20 mx-auto flex min-h-screen max-w-2xl flex-col px-5 pb-16 pt-10 sm:px-8 md:px-10 md:pb-20 md:pt-14">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={trans}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#00f2ff]/20 bg-black/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#00f2ff]/80 backdrop-blur-sm transition hover:border-[#00f2ff]/40 hover:bg-black/55 hover:text-[#00f2ff]"
          >
            <span aria-hidden>←</span> Back to landing
          </Link>
        </motion.div>

        <motion.div
          className="relative mt-10 flex justify-center md:mt-12"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...trans, delay: reduceMotion ? 0 : 0.05 }}
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10 scale-110 blur-3xl"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,242,255,0.22) 0%, transparent 68%)',
            }}
            aria-hidden
          />
          <ParableLogoMark className="relative w-full max-w-[min(20rem,88vw)] opacity-95 sm:max-w-sm" />
        </motion.div>

        <motion.div
          className="mt-10 md:mt-12"
          initial={reduceMotion ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...trans, delay: reduceMotion ? 0 : 0.12 }}
        >
          <p className="text-center text-[10px] font-black uppercase tracking-[0.38em] text-[#00f2ff]/65">
            Investor portal
          </p>
          <div className="mt-4 flex items-center justify-center gap-0">
            <div className="flex h-8 items-center rounded-l-full border border-[#00f2ff]/25 bg-[#00f2ff]/5 px-3 text-[9px] font-bold uppercase tracking-wider text-white/50">
              <span className="text-[#00f2ff]/90">✓</span>
              <span className="ml-1.5 hidden sm:inline">NDA</span>
            </div>
            <div className="flex h-8 items-center border-y border-[#00f2ff]/25 bg-[#00f2ff]/5 px-3 text-[9px] font-bold uppercase tracking-wider text-white/50">
              <span className="text-[#00f2ff]/90">✓</span>
              <span className="ml-1.5 hidden sm:inline">Access</span>
            </div>
            <div className="flex h-8 items-center rounded-r-full border border-[#00f2ff]/50 bg-[#00f2ff]/15 px-3 text-[9px] font-black uppercase tracking-wider text-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.15)]">
              3 · Continue
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
            Step 3 of 3
          </p>
        </motion.div>

        <motion.div
          className="mt-8 text-center md:mt-10"
          initial={reduceMotion ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...trans, delay: reduceMotion ? 0 : 0.18 }}
        >
          <h1 className="text-balance text-2xl font-black uppercase leading-tight tracking-[0.12em] text-[#00f2ff] drop-shadow-[0_0_24px_rgba(0,242,255,0.2)] sm:text-3xl sm:tracking-[0.16em]">
            You&apos;re cleared to continue
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/55 sm:text-[15px]">
            Your confidentiality agreement is on file. Choose how you&apos;d like to move forward—join
            the live session, review materials on your own timeline, or book a dedicated conversation.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col gap-4 md:mt-12 md:gap-5"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...trans, delay: reduceMotion ? 0 : 0.26 }}
        >
          <Link
            href={meetHref}
            className="parable-glass-panel group relative block overflow-hidden px-6 py-7 transition hover:-translate-y-0.5 hover:border-[#00f2ff]/50 hover:shadow-[0_0_40px_rgba(0,242,255,0.14)] md:px-8 md:py-8"
          >
            <div className="absolute right-5 top-5 text-[#00f2ff]/40 transition group-hover:text-[#00f2ff]/70">
              <VideoIcon className="h-7 w-7" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.32em] text-[#00f2ff]/90">
              Scheduled session
            </span>
            <span className="mt-2 block text-lg font-bold tracking-tight text-white">
              Join the live meeting
            </span>
            <span className="mt-2 block max-w-md text-sm leading-relaxed text-white/50">
              Enter the Parable video room for your investor session—same link your calendar invite uses.
            </span>
            <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f2ff] transition group-hover:gap-3">
              Open video room <span aria-hidden>→</span>
            </span>
          </Link>

          <Link
            href="/info/intro"
            className="parable-glass-panel group relative block overflow-hidden px-6 py-7 transition hover:-translate-y-0.5 hover:border-[#00f2ff]/50 hover:shadow-[0_0_40px_rgba(0,242,255,0.14)] md:px-8 md:py-8"
          >
            <div className="absolute right-5 top-5 text-[#00f2ff]/40 transition group-hover:text-[#00f2ff]/70">
              <DocIcon className="h-7 w-7" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.32em] text-[#00f2ff]/90">
              Materials
            </span>
            <span className="mt-2 block text-lg font-bold tracking-tight text-white">
              Review the investment overview
            </span>
            <span className="mt-2 block max-w-md text-sm leading-relaxed text-white/50">
              Objectives, structure, and session details—read at your pace before we talk live.
            </span>
            <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#00f2ff] transition group-hover:gap-3">
              Open materials <span aria-hidden>→</span>
            </span>
          </Link>
        </motion.div>

        <motion.div
          className="mt-12 md:mt-14"
          initial={reduceMotion ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...trans, delay: reduceMotion ? 0 : 0.34 }}
        >
          <RequestMeetingBlock />
        </motion.div>
      </div>
    </div>
  );
}
