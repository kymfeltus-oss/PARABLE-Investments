import Link from 'next/link';
import { ParablePortalFeatures } from '@/components/investor/ParablePortalFeatures';

/** Full investment intro / materials — used on `/info`. */
export function InvestorIntroContent() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="parable-eyebrow mb-4 text-center">Introduction</p>
      <h2 className="mb-6 text-center text-lg font-semibold leading-snug tracking-tight text-white md:text-xl">
        Parable — purpose of this conversation
      </h2>
      <p className="mb-10 text-center text-sm leading-relaxed text-white/55 md:text-[15px]">
        This site is the entry point for a focused discussion with qualified investors about{' '}
        <span className="text-white/85">Parable</span>: a protocol-shaped platform where ministry, testimony, study, and
        live creation come together for audiences who want depth—not only scale.
      </p>

      <div className="mb-10">
        <ParablePortalFeatures variant="full" />
      </div>

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
        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#00f2ff]/80">Confidentiality</h3>
        <p className="mt-4 text-sm leading-relaxed text-white/50 md:text-[15px]">
          Materials shared in connection with this introduction are provided for evaluation only and are not an offer to
          sell securities. Please treat deck materials, metrics, and product plans as confidential unless we agree
          otherwise in writing.
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

      <div className="mt-12 flex flex-col flex-wrap items-center justify-center gap-6 sm:flex-row sm:gap-10">
        <Link
          href="/explore"
          className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#00f2ff]/75 hover:text-[#00f2ff] md:text-[11px]"
        >
          App prototype →
        </Link>
        <Link
          href="/meet"
          className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#00f2ff]/75 hover:text-[#00f2ff] md:text-[11px]"
        >
          Investor video room →
        </Link>
        <Link
          href="/start"
          className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35 hover:text-white/55 md:text-[11px]"
        >
          ← Choice hub
        </Link>
      </div>

      <p className="mt-14 text-center text-[10px] uppercase tracking-[0.25em] text-white/25 md:text-[11px]">
        parableinvestments.com — internal &amp; investor use only
      </p>
    </div>
  );
}
