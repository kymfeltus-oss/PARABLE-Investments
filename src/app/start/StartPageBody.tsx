import Link from 'next/link';
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

export default function StartPageBody() {
  const meetHref = scheduledMeetHref();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <InvestorAtmosphere />
      <div className="relative z-20 mx-auto flex min-h-screen max-w-lg flex-col px-4 py-10 md:max-w-xl md:py-14">
        <Link href="/" className="parable-eyebrow mb-8 inline-block hover:text-[#00f2ff]">
          ← Landing
        </Link>

        <ParableLogoMark className="mb-8 w-full max-w-xs opacity-90 md:max-w-sm" />

        <p className="parable-eyebrow mb-2 text-center">Step 3 of 3</p>
        <h1 className="mb-3 text-center text-lg font-black uppercase tracking-[0.2em] text-[#00f2ff] drop-shadow-[0_0_12px_rgba(0,242,255,0.25)] md:text-xl md:tracking-[0.28em]">
          How would you like to continue?
        </h1>
        <p className="mb-10 text-center text-sm text-white/45">
          Join the live meeting, review materials on your own, or request a new time.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href={meetHref}
            className="parable-glass-panel group block px-6 py-6 text-left transition hover:border-[#00f2ff]/45 hover:shadow-[0_0_32px_rgba(0,242,255,0.12)] md:px-8 md:py-7"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00f2ff]/85">
              Scheduled session
            </span>
            <span className="mt-2 block text-base font-semibold text-white">Join the live meeting</span>
            <span className="mt-2 block text-sm leading-relaxed text-white/45">
              Opens the Parable meeting room.
            </span>
            <span className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-wider text-[#00f2ff]/70 group-hover:text-[#00f2ff]">
              Enter video room →
            </span>
          </Link>

          <Link
            href="/info"
            className="parable-glass-panel group block px-6 py-6 text-left transition hover:border-[#00f2ff]/45 hover:shadow-[0_0_32px_rgba(0,242,255,0.12)] md:px-8 md:py-7"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00f2ff]/85">
              Materials
            </span>
            <span className="mt-2 block text-base font-semibold text-white">Review the investment information</span>
            <span className="mt-2 block text-sm leading-relaxed text-white/45">
              Introduction, objectives, confidentiality, and session details—read at your pace before we talk.
            </span>
            <span className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-wider text-[#00f2ff]/70 group-hover:text-[#00f2ff]">
              Open materials →
            </span>
          </Link>
        </div>

        <div className="mt-10">
          <RequestMeetingBlock />
        </div>
      </div>
    </div>
  );
}
