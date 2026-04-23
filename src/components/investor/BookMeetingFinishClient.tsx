'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { BookMeetingPostRegisterView } from '@/components/investor/BookMeetingPostRegisterView';
import { ReturnToProposalDeck } from '@/components/investor/ReturnToProposalDeck';
import {
  type BookMeetingSessionPayload,
  readBookMeetingSession,
} from '@/lib/book-meeting-session';
import { hrefWithFromProposal } from '@/lib/proposal-deck-return';

type Props = { embedSrc: string | null };

export function BookMeetingFinishClient({ embedSrc }: Props) {
  const router = useRouter();
  const search = useSearchParams();
  const fromProposal = search.get('fromProposal') === '1';
  const [payload, setPayload] = useState<BookMeetingSessionPayload | null | undefined>(undefined);

  useEffect(() => {
    // sessionStorage is not available on the server; read once after mount.
    void queueMicrotask(() => setPayload(readBookMeetingSession()));
  }, []);

  useEffect(() => {
    if (payload && embedSrc) {
      const t = setTimeout(() => {
        const el = document.getElementById('book-schedule-embed');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [payload, embedSrc]);

  if (payload === undefined) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
        <InvestorAtmosphere />
        <div className="relative z-20 mx-auto max-w-3xl px-4 py-16 text-center text-sm text-white/50">Loading…</div>
      </div>
    );
  }

  if (payload === null) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
        <InvestorAtmosphere />
        <div className="relative z-20 mx-auto max-w-3xl px-4 py-14 text-center">
          <ReturnToProposalDeck className="mb-6 text-left" />
          <ParableLogoMark className="mx-auto mb-6 max-w-[200px] opacity-95" />
          <h1 className="text-lg font-black uppercase tracking-[0.2em] text-white">Start from step 1</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
            Register first, then you will be brought back here to choose a time. If you opened this link in a new
            device or your session expired, go back to Book a meeting.
          </p>
          <Link
            href={hrefWithFromProposal('/book', fromProposal)}
            className="mt-8 inline-block rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#00f2ff] hover:bg-[#00f2ff]/20"
          >
            Book a meeting
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <InvestorAtmosphere />
      <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,242,255,0.06)_0%,transparent_50%,rgba(0,0,0,0.85)_100%)]" />
      <div className="relative z-20 mx-auto max-w-3xl px-4 py-10 pb-28 md:py-14">
        <ReturnToProposalDeck className="mb-4" />
        <button
          type="button"
          onClick={() => router.push(hrefWithFromProposal('/book', fromProposal))}
          className="parable-eyebrow mb-8 block text-left hover:text-[#00f2ff]"
        >
          ← Book a meeting
        </button>
        <ParableLogoMark className="mx-auto mb-8 max-w-[200px] opacity-95 md:max-w-xs" />
        <div className="text-center">
          <p className="parable-eyebrow mb-2 text-[#00f2ff]/85">Investor relations</p>
          <h1 className="text-2xl font-black uppercase tracking-[0.18em] text-white md:text-3xl md:tracking-[0.22em]">
            Choose a time
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/45">
            Use the calendar first. After you have a slot, request the Parable confirmation email for your video room and
            room ID. Your calendar provider may send a separate time confirmation.
          </p>
        </div>
        <BookMeetingPostRegisterView
          embedSrc={embedSrc}
          emailStatus={payload.emailStatus}
          resendErrorMessage={payload.resendErrorMessage}
          roomLabel={payload.roomLabel}
          roomSuffix={payload.roomSuffix}
          meetUrl={payload.meetUrl}
          registrationId={payload.registrationId}
          contactEmail={payload.contactEmail}
          registerAgainHref={hrefWithFromProposal('/book', fromProposal)}
        />
      </div>
    </div>
  );
}
