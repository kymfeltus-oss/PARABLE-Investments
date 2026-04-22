'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import MeetRoom from './MeetRoom';

type Props = {
  serverUrl: string;
  initialRoomSuffix?: string;
  /** /meet?join=scheduled — email + room must match booking confirmation. */
  scheduledVerification?: boolean;
};

export default function MeetClient({ serverUrl, initialRoomSuffix, scheduledVerification }: Props) {
  const router = useRouter();

  /** Back/forward cache can restore a stale `/meet` document; refresh server components so UI matches the latest deploy. */
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) router.refresh();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [router]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <InvestorAtmosphere sparkleCount={40} />
      <div className="relative z-20 mx-auto flex min-h-screen max-w-4xl flex-col items-center px-4 py-10 text-white md:py-14">
        <ParableLogoMark className="mb-8 w-full max-w-xs md:max-w-sm" />

        <Link href="/start" className="parable-eyebrow mb-8 hover:text-[#00f2ff]">
          ← Choice hub
        </Link>

        <h1 className="mb-3 text-center text-lg font-black uppercase tracking-[0.25em] text-[#00f2ff] drop-shadow-[0_0_12px_rgba(0,242,255,0.35)] md:text-xl md:tracking-[0.35em]">
          Parable meeting
        </h1>
        <div className="mb-10" aria-hidden />

        <div className="w-full">
          <MeetRoom
            serverUrl={serverUrl}
            initialRoomSuffix={initialRoomSuffix}
            scheduledVerification={scheduledVerification}
          />
        </div>
      </div>
    </div>
  );
}
