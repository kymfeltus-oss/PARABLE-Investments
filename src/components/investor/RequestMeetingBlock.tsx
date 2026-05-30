import Link from 'next/link';
import { hrefWithFromProposal } from '@/lib/proposal-deck-return';

export function RequestMeetingBlock() {
  return (
    <div className="parable-glass-panel px-6 py-8 transition hover:border-[#00D4FF]/35 md:px-8 md:py-10 lg:py-12">
      <h3 className="text-xs font-black uppercase tracking-[0.28em] text-[#00D4FF]/90 md:text-sm">
        Prefer a different time?
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/55 md:text-base">
        Register for our records, confirm by email, then choose a slot when the calendar opens.
      </p>

      <Link
        href={hrefWithFromProposal('/book/moment', true)}
        className="mt-6 flex w-full items-center justify-center rounded-xl border border-[#00D4FF]/40 bg-[#00D4FF]/10 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#00D4FF] shadow-[0_0_28px_rgba(0, 212, 255,0.14)] transition hover:bg-[#00D4FF]/20 hover:shadow-[0_0_36px_rgba(0, 212, 255,0.2)] md:mt-8 md:py-5 md:text-base"
      >
        Book with calendar
      </Link>
    </div>
  );
}
