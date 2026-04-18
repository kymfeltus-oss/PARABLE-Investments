import Link from 'next/link';

export function RequestMeetingBlock() {
  return (
    <div className="parable-glass-panel px-6 py-8 md:px-8 md:py-10">
      <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#00f2ff]/80">Request a meeting</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/50">
        Register for our records, check your email for confirmation, then pick a time in the calendar when it appears.
      </p>

      <Link
        href="/book"
        className="mt-6 flex w-full items-center justify-center rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#00f2ff] shadow-[0_0_24px_rgba(0,242,255,0.12)] transition hover:bg-[#00f2ff]/20"
      >
        Book with calendar
      </Link>
    </div>
  );
}
