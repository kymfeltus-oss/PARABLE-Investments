'use client';

import type { ComponentType, ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { getInvestorScheduledMeetHref } from '@/lib/meeting-links';

const INVESTOR_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL?.trim() || 'investors@parableinvestments.com';

const startKeyframes = `
@keyframes parable-start-orb {
  0%, 100% { opacity: 0.38; transform: scale(1) translate(0, 0); }
  40% { opacity: 0.62; transform: scale(1.06) translate(3%, -4%); }
  70% { opacity: 0.48; transform: scale(0.97) translate(-4%, 3%); }
}
@keyframes parable-start-spin {
  to { transform: rotate(360deg); }
}
@keyframes parable-start-beacon {
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.35); }
}
`;

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

function AppGridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19V5M4 19h16M8 15V9m4 8V7m4 6v-4m4 4v-8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function hapticTap() {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(10);
    }
  } catch {
    /* ignore */
  }
}

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const staggerWrap = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

type IconComp = ComponentType<{ className?: string }>;

type RunwayDef = {
  id: string;
  step: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  Icon: IconComp;
};

function PathGridItem({
  reduceMotion,
  className,
  children,
}: {
  reduceMotion: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={className}
      variants={reduceMotion ? undefined : staggerItem}
      initial={reduceMotion ? false : undefined}
      animate={reduceMotion ? { opacity: 1, y: 0 } : undefined}
    >
      {children}
    </motion.div>
  );
}

export default function StartPageBody() {
  const meetHref = getInvestorScheduledMeetHref();
  const reduceMotion = useReducedMotion();
  const motionOff = reduceMotion === true;
  const trans = motionOff ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };
  const contactSubject = encodeURIComponent('PARABLE investor inquiry');
  const mailtoHref = `mailto:${INVESTOR_CONTACT_EMAIL}?subject=${contactSubject}`;

  const runway: RunwayDef[] = [
    {
      id: 'meet',
      step: '02',
      eyebrow: 'Scheduled session',
      title: 'Join the live meeting',
      body: 'Parable video room—investor-grade screen share, same join rhythm as your calendar invite.',
      cta: 'Enter live room',
      href: meetHref,
      Icon: VideoIcon,
    },
    {
      id: 'book',
      step: '03',
      eyebrow: 'Schedule meeting',
      title: 'Book a conversation',
      body: 'Register, confirm by email, then lock a slot when the calendar opens.',
      cta: 'Open scheduler',
      href: '/book',
      Icon: CalendarIcon,
    },
    {
      id: 'calc',
      step: '04',
      eyebrow: 'Financial model',
      title: 'Yield calculator',
      body: 'Stress adoption, recovery, and overhead—see implied gross yield and NOI framing.',
      cta: 'Run the model',
      href: '/investor/financial-calculator',
      Icon: CalculatorIcon,
    },
    {
      id: 'explore',
      step: '05',
      eyebrow: 'Product preview',
      title: 'Explore the Parable app',
      body: 'Live embed when configured; otherwise the brand-matched hub shell and navigation preview.',
      cta: 'Launch preview',
      href: '/explore',
      Icon: AppGridIcon,
    },
  ];

  const runwayCardClass =
    'group relative flex h-full min-h-[13.5rem] w-[min(88vw,18.5rem)] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.06] to-transparent px-5 pb-5 pt-6 shadow-[0_0_0_1px_rgba(0,242,255,0.05)_inset,0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl transition duration-300 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#00f2ff]/70 before:to-transparent before:opacity-50 after:pointer-events-none after:absolute after:-right-4 after:bottom-0 after:text-[5.5rem] after:font-black after:leading-none after:text-[#00f2ff]/[0.07] after:content-[attr(data-step)] hover:-translate-y-1 hover:border-[#00f2ff]/45 hover:shadow-[0_0_48px_rgba(0,242,255,0.12)] hover:before:opacity-100 md:min-h-0 md:w-auto md:rounded-3xl md:px-6 md:pb-6 md:pt-7 lg:min-h-[15rem]';

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#030304] text-white">
      <style dangerouslySetInnerHTML={{ __html: startKeyframes }} />

      <div
        className="pointer-events-none fixed inset-0 z-[5] bg-[radial-gradient(ellipse_100%_70%_at_50%_-20%,rgba(0,242,255,0.18),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[6] bg-[radial-gradient(circle_at_15%_85%,rgba(0,242,255,0.07),transparent_42%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[7] bg-[radial-gradient(circle_at_92%_30%,rgba(56,189,248,0.06),transparent_40%)]"
        aria-hidden
      />

      <div
        className="pointer-events-none fixed left-1/2 top-[-18%] z-[8] h-[min(92vw,34rem)] w-[min(92vw,34rem)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,242,255,0.28)_0%,transparent_68%)] blur-3xl"
        style={motionOff ? undefined : { animation: 'parable-start-orb 16s ease-in-out infinite' }}
        aria-hidden
      />

      <div
        className="pointer-events-none fixed inset-0 z-[9] opacity-[0.04] mix-blend-overlay [background-image:linear-gradient(rgba(0,242,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.25)_1px,transparent_1px)] [background-size:100%_8px,10px_100%] md:opacity-[0.055]"
        aria-hidden
      />

      <InvestorAtmosphere sparkleCount={72} />

      <div className="relative z-20 mx-auto flex min-h-screen max-w-2xl flex-col px-4 pb-20 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 md:max-w-6xl md:px-10 md:pb-28 md:pt-[max(1rem,env(safe-area-inset-top))] lg:max-w-7xl">
        {/* HUD */}
        <motion.header
          className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-5"
          initial={motionOff ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={trans}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#00f2ff]/25 bg-black/50 px-3 py-2 text-[9px] font-black uppercase tracking-[0.26em] text-[#00f2ff]/85 backdrop-blur-md transition hover:border-[#00f2ff]/45 hover:bg-black/70 hover:text-[#00f2ff] sm:px-4 sm:text-[10px]"
          >
            <span aria-hidden>←</span> Landing
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/40 px-3 py-1.5 backdrop-blur-md sm:gap-3 sm:px-4">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-[#00f2ff] opacity-60"
                style={motionOff ? undefined : { animation: 'parable-start-beacon 2.4s ease-in-out infinite' }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00f2ff] shadow-[0_0_12px_#00f2ff]" />
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/55 sm:text-[10px] sm:tracking-[0.28em]">
              Clearance live
            </span>
          </div>
        </motion.header>

        <motion.div
          className="relative mt-8 flex justify-center md:mt-10"
          initial={motionOff ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...trans, delay: motionOff ? 0 : 0.06 }}
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10 scale-[1.15] blur-3xl"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,242,255,0.28) 0%, transparent 70%)',
            }}
            aria-hidden
          />
          <ParableLogoMark className="relative w-full max-w-[min(18rem,82vw)] opacity-[0.98] sm:max-w-xs md:max-w-md lg:max-w-lg" />
        </motion.div>

        <motion.div
          className="mt-6 flex justify-center md:mt-8"
          initial={motionOff ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...trans, delay: motionOff ? 0 : 0.1 }}
        >
          <div className="inline-flex items-center gap-px rounded-full border border-[#00f2ff]/30 bg-black/50 p-1 shadow-[0_0_32px_rgba(0,242,255,0.12)] backdrop-blur-md">
            <span className="rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#00f2ff]/90 sm:px-4 sm:text-[10px]">
              ✓ NDA
            </span>
            <span className="h-4 w-px bg-white/15" aria-hidden />
            <span className="rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#00f2ff]/90 sm:px-4 sm:text-[10px]">
              ✓ Access
            </span>
            <span className="h-4 w-px bg-white/15" aria-hidden />
            <span className="rounded-full bg-[#00f2ff]/15 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[#00f2ff] sm:px-4 sm:text-[10px]">
              Step 3 · Go
            </span>
          </div>
        </motion.div>

        {/* Hero */}
        <motion.section
          className="relative mt-8 text-center md:mt-12"
          initial={motionOff ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...trans, delay: motionOff ? 0 : 0.14 }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.42em] text-[#00f2ff]/75 md:text-[11px] md:tracking-[0.5em]">
            Investor gateway
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl text-balance font-black uppercase leading-[0.95] tracking-[0.08em] sm:tracking-[0.1em] md:max-w-5xl">
            <span className="block text-3xl text-white/90 sm:text-4xl md:text-5xl">You&apos;re</span>
            <span className="mt-1 block bg-gradient-to-b from-white via-[#c4fffe] to-[#00f2ff] bg-clip-text text-4xl text-transparent drop-shadow-[0_0_40px_rgba(0,242,255,0.35)] sm:text-5xl md:mt-2 md:text-6xl lg:text-7xl">
              Cleared
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-sm leading-relaxed text-white/55 sm:max-w-xl sm:text-[15px] md:mt-6 md:max-w-2xl md:text-base lg:text-lg">
            NDA is on file. Below is your <span className="text-white/80">live command surface</span>—deck first, then
            room, calendar, model, app preview, or a direct line to our desk.
          </p>
        </motion.section>

        {/* Featured portal — conic signal frame */}
        <motion.section
          className="relative mt-10 md:mt-14"
          initial={motionOff ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...trans, delay: motionOff ? 0 : 0.2 }}
          aria-labelledby="start-featured-heading"
        >
          <div className="mb-4 flex items-center justify-between gap-3 px-1">
            <h2 id="start-featured-heading" className="text-left text-[10px] font-black uppercase tracking-[0.35em] text-[#00f2ff]/80">
              Primary vector · 01
            </h2>
            <span className="hidden text-[10px] font-mono uppercase tracking-wider text-white/35 md:inline">
              Signal locked
            </span>
          </div>

          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[1.75rem] p-px shadow-[0_0_60px_rgba(0,242,255,0.12)] lg:max-w-5xl">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(0,242,255,0)_0deg,rgba(0,242,255,0.15)_80deg,rgba(125,211,252,0.35)_180deg,rgba(0,242,255,0.12)_260deg,rgba(0,242,255,0)_360deg)] opacity-90"
              style={motionOff ? undefined : { animation: 'parable-start-spin 14s linear infinite' }}
              aria-hidden
            />
            <Link
              href="/investor/portal"
              onPointerDown={hapticTap}
              className="relative z-10 flex min-h-[17rem] flex-col justify-between overflow-hidden rounded-[1.73rem] bg-gradient-to-br from-[#0a0c12] via-[#050506] to-black px-6 py-7 transition duration-300 hover:brightness-[1.03] sm:min-h-[18rem] sm:px-8 sm:py-8 md:min-h-[19rem] md:flex-row md:items-end md:gap-10 md:px-10 md:py-10"
            >
              <div
                className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#00f2ff]/15 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl"
                aria-hidden
              />

              <div className="relative max-w-xl md:pb-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#00f2ff]/35 bg-[#00f2ff]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-[#00f2ff]">
                  Investor portal
                </span>
                <span className="mt-5 block text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
                  Open the strategic deck
                </span>
                <p className="mt-4 text-sm leading-relaxed text-white/55 md:text-[15px] lg:text-base">
                  Confidential proposal embed—Gamma-class fidelity, hosted on this site after clearance. This is the main
                  event.
                </p>
              </div>
              <div className="relative mt-8 flex shrink-0 flex-col items-start gap-3 md:mt-0 md:items-end">
                <div className="rounded-2xl border border-[#00f2ff]/25 bg-black/50 p-3 text-[#00f2ff]/80 backdrop-blur-sm md:p-4">
                  <DocIcon className="h-10 w-10 md:h-12 md:w-12" />
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#00f2ff]/40 bg-[#00f2ff]/15 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#00f2ff] shadow-[0_0_28px_rgba(0,242,255,0.2)] transition group-hover:gap-3 md:text-xs">
                  Launch portal <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </div>
        </motion.section>

        {/* Runway */}
        <motion.section
          className="relative mt-12 md:mt-16"
          initial={motionOff ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...trans, delay: motionOff ? 0 : 0.24 }}
          aria-labelledby="start-runway-heading"
        >
          <div className="mb-4 flex flex-col gap-1 px-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="start-runway-heading" className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00f2ff]/80">
                Mission channels · 02–05
              </h2>
              <p className="mt-1 max-w-md text-[12px] leading-relaxed text-white/45 sm:text-[13px]">
                On your phone, swipe the row—each card is a full route. On desktop, they expand into a grid.
              </p>
            </div>
          </div>

          <motion.div
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
            variants={motionOff ? undefined : staggerWrap}
            initial={motionOff ? false : 'hidden'}
            animate={motionOff ? { opacity: 1 } : 'show'}
          >
            {runway.map((item) => {
              const Icon = item.Icon;
              return (
                <PathGridItem key={item.id} reduceMotion={motionOff} className="md:min-w-0">
                  <Link
                    href={item.href}
                    id={item.id === 'book' ? 'schedule-meeting' : undefined}
                    data-step={item.step}
                    onPointerDown={hapticTap}
                    className={runwayCardClass}
                  >
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <span className="font-mono text-[10px] font-bold text-[#00f2ff]/55">{item.step}</span>
                      <div className="rounded-xl border border-[#00f2ff]/20 bg-[#00f2ff]/[0.07] p-2 text-[#00f2ff]/75 transition group-hover:border-[#00f2ff]/40 group-hover:text-[#00f2ff]">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <span className="relative z-10 mt-4 block text-[10px] font-black uppercase tracking-[0.28em] text-[#00f2ff]/90">
                      {item.eyebrow}
                    </span>
                    <span className="relative z-10 mt-1.5 block text-lg font-bold tracking-tight text-white md:text-xl">
                      {item.title}
                    </span>
                    <p className="relative z-10 mt-2 flex-1 text-[13px] leading-relaxed text-white/50 md:text-sm">
                      {item.body}
                    </p>
                    <span className="relative z-10 mt-5 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#00f2ff] transition group-hover:gap-3 sm:text-[11px]">
                      {item.cta} <span aria-hidden>→</span>
                    </span>
                  </Link>
                </PathGridItem>
              );
            })}
          </motion.div>
        </motion.section>

        {/* Contact band */}
        <motion.section
          className="relative mt-10 md:mt-12"
          initial={motionOff ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...trans, delay: motionOff ? 0 : 0.32 }}
          aria-labelledby="start-contact-heading"
        >
          <h2 id="start-contact-heading" className="sr-only">
            Contact us
          </h2>
          <a
            href={mailtoHref}
            onPointerDown={hapticTap}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#00f2ff]/35 bg-gradient-to-r from-black/80 via-[#061016] to-black/80 px-6 py-8 shadow-[0_0_48px_rgba(0,242,255,0.1)] transition hover:border-[#00f2ff]/55 hover:shadow-[0_0_64px_rgba(0,242,255,0.16)] md:flex-row md:items-center md:justify-between md:gap-10 md:rounded-3xl md:px-10 md:py-10"
          >
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_80%_50%,rgba(0,242,255,0.12),transparent_65%)]"
              aria-hidden
            />
            <div className="relative flex items-start gap-4 md:items-center md:gap-6">
              <div className="rounded-2xl border border-[#00f2ff]/25 bg-[#00f2ff]/10 p-3 text-[#00f2ff] md:p-4">
                <EnvelopeIcon className="h-8 w-8 md:h-9 md:w-9" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold text-[#00f2ff]/55">06</span>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.3em] text-[#00f2ff]/90">Contact us</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55 md:text-[15px]">
                  Direct line:{' '}
                  <span className="font-medium text-[#00f2ff]/90">{INVESTOR_CONTACT_EMAIL}</span>
                  <span className="text-white/40"> — same routing as confirmations when configured.</span>
                </p>
              </div>
            </div>
            <span className="relative mt-6 inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#00f2ff]/40 bg-[#00f2ff]/10 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#00f2ff] transition group-hover:gap-3 md:mt-0 md:self-center">
              Compose email <span aria-hidden>→</span>
            </span>
          </a>
        </motion.section>

        <motion.p
          className="mt-10 text-center text-[12px] leading-relaxed text-white/38 md:mt-12 md:text-[13px]"
          initial={motionOff ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...trans, delay: motionOff ? 0 : 0.38 }}
        >
          Need the full click-through mock with no hosted prototype URL?{' '}
          <Link
            href="/parable-demo"
            className="font-semibold text-[#00f2ff]/85 underline decoration-[#00f2ff]/35 underline-offset-4 hover:text-[#00f2ff] hover:decoration-[#00f2ff]/60"
          >
            Open the on-site interactive demo
          </Link>
          .
        </motion.p>
      </div>
    </div>
  );
}
