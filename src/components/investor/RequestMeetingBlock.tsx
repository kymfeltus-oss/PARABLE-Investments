import Link from 'next/link';
import { hrefWithFromProposal } from '@/lib/proposal-deck-return';

export function RequestMeetingBlock() {
  return (
    <div className="parable-glass-panel px-6 py-8 transition hover:border-[var(--cyan)]/35 md:px-8 md:py-10 lg:py-12">
      <h3 className="text-xs font-black uppercase tracking-[0.28em] text-[var(--cyan)]/90 md:text-sm">
        Prefer a different time?
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/55 md:text-base">
        Register for our records, confirm by email, then choose a slot when the calendar opens.
      </p>

      <Link
        href={hrefWithFromProposal('/book/moment', true)}
        className="primary-button primary-button-outline type-nav mt-6 md:mt-8"
      >
        Book with calendar
      </Link>
    </div>
  );
}
