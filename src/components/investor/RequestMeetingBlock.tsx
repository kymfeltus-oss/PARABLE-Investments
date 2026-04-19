import Link from 'next/link';

export function RequestMeetingBlock() {
  return (
    <div className="parable-glass-panel px-6 py-8 transition hover:border-[#00f2ff]/35 md:px-8 md:py-10">
      <h3 className="text-xs font-black uppercase tracking-[0.28em] text-[#00f2ff]/90">
        Prefer a different time?
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/55">
        Register for our records, confirm by email, then choose a slot when the calendar opens.
      </p>

      <Link
        href="/book"
        className="mt-6 flex w-full items-center justify-center rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#00f2ff] shadow-[0_0_28px_rgba(0,242,255,0.14)] transition hover:bg-[#00f2ff]/20 hover:shadow-[0_0_36px_rgba(0,242,255,0.2)]"
      >
        Book with calendar
      </Link>
    </div>
  );
}
