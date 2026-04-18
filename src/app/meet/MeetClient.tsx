'use client';

import Link from 'next/link';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import MeetRoom from './MeetRoom';

type Props = {
  serverUrl: string;
};

export default function MeetClient({ serverUrl }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <InvestorAtmosphere />
      <div className="relative z-20 mx-auto flex min-h-screen max-w-4xl flex-col items-center px-4 py-10 text-white md:py-14">
        <ParableLogoMark className="mb-8 w-full max-w-xs md:max-w-sm" />

        <Link
          href="/"
          className="parable-eyebrow mb-8 hover:text-[#00f2ff]"
        >
          ← Back to overview
        </Link>

        <h1 className="mb-3 text-center text-lg font-black uppercase tracking-[0.25em] text-[#00f2ff] drop-shadow-[0_0_12px_rgba(0,242,255,0.35)] md:text-xl md:tracking-[0.35em]">
          Investor video room
        </h1>
        <p className="mb-10 max-w-lg text-center text-sm text-white/50">
          Same LiveKit stack as the PARABLE app for real-time video. Share the room suffix; everyone joins{' '}
          <code className="text-[#00f2ff]/90">investor-…</code>.
        </p>

        <div className="w-full">
          <MeetRoom serverUrl={serverUrl} />
        </div>
      </div>
    </div>
  );
}
