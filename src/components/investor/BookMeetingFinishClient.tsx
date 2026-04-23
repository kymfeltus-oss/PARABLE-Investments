'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { BookMeetingPostRegisterView } from '@/components/investor/BookMeetingPostRegisterView';
import { BookMeetingWizard } from '@/components/investor/BookMeetingWizard';
import { BookSchedulingEmbed } from '@/components/investor/BookSchedulingEmbed';
import { ReturnToProposalDeck } from '@/components/investor/ReturnToProposalDeck';
import {
  type BookMeetingSessionPayload,
  clearBookMeetingSession,
  readBookMeetingSession,
} from '@/lib/book-meeting-session';
import { hrefWithFromProposal } from '@/lib/proposal-deck-return';

type Props = { embedSrc: string | null };

export function BookMeetingFinishClient({ embedSrc }: Props) {
  const search = useSearchParams();
  const fromProposal = search.get('fromProposal') === '1';
  const [payload, setPayload] = useState<BookMeetingSessionPayload | null | undefined>(undefined);
  const [bookingKey, setBookingKey] = useState(0);

  const refreshPayload = useCallback(() => {
    setPayload(readBookMeetingSession());
  }, []);

  useEffect(() => {
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

  const restartBooking = useCallback(() => {
    clearBookMeetingSession();
    setPayload(null);
    setBookingKey((k) => k + 1);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

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
        <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,242,255,0.06)_0%,transparent_50%,rgba(0,0,0,0.85)_100%)]" />
        <div className="relative z-20 mx-auto max-w-3xl px-4 py-10 pb-28 md:py-14">
          <ReturnToProposalDeck className="mb-4" />
          <Link href="/start" className="parable-eyebrow mb-6 inline-block hover:text-[#00f2ff]">
            ← Choice hub
          </Link>
          <ParableLogoMark className="mx-auto mb-8 max-w-[200px] opacity-95 md:max-w-xs" />
          <div className="text-center">
            <p className="parable-eyebrow mb-2 text-[#00f2ff]/85">Investor relations</p>
            <h1 className="text-2xl font-black uppercase tracking-[0.18em] text-white md:text-3xl md:tracking-[0.22em]">
              Book a meeting
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/45">
              <strong className="text-white/60">Choose a time</strong> in the calendar first. Then enter your name and
              the email for your Parable confirmation (we pre-fill from your NDA on this browser when we have it—you can
              change it).
            </p>
          </div>

          {embedSrc ? (
            <div className="mt-10">
              <BookSchedulingEmbed embedSrc={embedSrc} />
            </div>
          ) : (
            <p className="mx-auto mt-10 max-w-lg text-center text-sm text-amber-200/85">
              Calendar embed is not configured. Set <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_SCHEDULING_URL</code>{' '}
              or <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_SCHEDULING_EMBED_URL</code>, then redeploy. You can
              still save your meeting record below.
            </p>
          )}

          <BookMeetingWizard
            key={bookingKey}
            compact
            onRegistered={() => {
              refreshPayload();
            }}
          />
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
          onClick={restartBooking}
          className="parable-eyebrow mb-8 block text-left hover:text-[#00f2ff]"
        >
          ← New booking
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
          onRegisterAgain={restartBooking}
        />
      </div>
    </div>
  );
}
