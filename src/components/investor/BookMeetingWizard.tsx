'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { INVESTOR_AGREEMENT_VERSION } from '@/lib/investor-agreement-text';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';
import { getInvestorBookingEmailHint } from '@/lib/investor-booking-email-hint';
import { writeBookMeetingSession } from '@/lib/book-meeting-session';
import { ReturnToProposalDeck } from '@/components/investor/ReturnToProposalDeck';
import { hrefWithFromProposal } from '@/lib/proposal-deck-return';

export type BookMeetingWizardProps = {
  /** When true, only the form card (parent supplies page chrome). Used on `/book` before session exists. */
  compact?: boolean;
  /** After successful `POST /api/meeting/register`, call this instead of navigating (e.g. stay on `/book`). */
  onRegistered?: () => void;
};

export function BookMeetingWizard({ compact = false, onRegistered }: BookMeetingWizardProps = {}) {
  const router = useRouter();
  const sp = useSearchParams();
  const fromProposal = sp.get('fromProposal') === '1';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ack, setAck] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (compact) {
      const hint = getInvestorBookingEmailHint();
      if (hint && isValidInvestorEmail(hint)) {
        setEmail((prev) => (prev.trim() ? prev : hint));
      }
    }
  }, [compact]);

  const canRegister =
    name.trim().length >= 2 && isValidInvestorEmail(email.trim()) && ack && !submitting;

  const onRegister = async () => {
    if (!canRegister) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/meeting/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          acknowledged: true,
          deferEmailUntilAfterSlot: true,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        supabaseCode?: string;
        ok?: boolean;
        emailSent?: boolean;
        emailStatus?: 'sent' | 'unconfigured' | 'failed' | 'deferred';
        resendErrorMessage?: string | null;
        roomLabel?: string;
        roomSuffix?: string;
        meetUrl?: string;
        registrationId?: string;
      };
      if (!res.ok || !data.ok) {
        setError(
          [data.error || 'Something went wrong. Try again.', data.supabaseCode ? `Supabase/Postgres: ${data.supabaseCode}` : null]
            .filter(Boolean)
            .join('\n\n'),
        );
        setSubmitting(false);
        return;
      }
      const status = data.emailStatus ?? (data.emailSent ? 'sent' : 'unconfigured');
      writeBookMeetingSession({
        emailStatus: status,
        resendErrorMessage: typeof data.resendErrorMessage === 'string' ? data.resendErrorMessage : null,
        roomLabel: typeof data.roomLabel === 'string' && data.roomLabel ? data.roomLabel : null,
        roomSuffix: typeof data.roomSuffix === 'string' && data.roomSuffix ? data.roomSuffix : null,
        meetUrl: typeof data.meetUrl === 'string' && data.meetUrl ? data.meetUrl : null,
        registrationId: typeof data.registrationId === 'string' && data.registrationId ? data.registrationId : null,
        contactEmail: email.trim().toLowerCase(),
      });
      if (onRegistered) {
        onRegistered();
      } else {
        router.push(hrefWithFromProposal('/book', fromProposal));
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formCard = (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.12] bg-black/40 p-6 shadow-[0_8px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-8"
    >
      <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#00f2ff]/85">
        {compact ? 'Meeting record — name & email' : 'Step 1 — Register'}
      </h2>
      <p className="mt-2 text-sm text-white/50">
        {compact ? (
          <>
            Use the <strong className="text-white/65">same email as your NDA</strong> when possible (we pre-fill it when
            this browser signed the NDA). You may edit it. We store this with NDA version{' '}
            <span className="text-white/70">{INVESTOR_AGREEMENT_VERSION}</span>, then you can request the Parable
            confirmation for your video room below.
          </>
        ) : (
          <>
            We store this with NDA version <span className="text-white/70">{INVESTOR_AGREEMENT_VERSION}</span> for our
            records, then take you to <strong className="text-white/60">choose a time</strong> and request your
            confirmation email.
          </>
        )}
      </p>
      <div className="mt-6 space-y-4">
        <label className="block text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Full name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm outline-none focus:border-[#00f2ff]/45"
            placeholder="Jane Investor"
            autoComplete="name"
          />
        </label>
        <label className="block text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm outline-none focus:border-[#00f2ff]/45"
            placeholder="you@firm.com"
            autoComplete="email"
          />
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-4">
          <input
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-[#00f2ff]/40 text-[#00f2ff] focus:ring-[#00f2ff]"
          />
          <span className="text-left text-sm text-white/65">
            I confirm this investor meeting request is subject to the same confidentiality obligations as my Parable NDA /
            electronic acknowledgment (version {INVESTOR_AGREEMENT_VERSION}). I understand Parable will retain this
            registration as supplemental evidence.
          </span>
        </label>
        {error ? <p className="whitespace-pre-line text-sm text-red-300/95">{error}</p> : null}
        <button
          type="button"
          disabled={!canRegister}
          onClick={onRegister}
          className="w-full rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#00f2ff] transition hover:bg-[#00f2ff]/20 disabled:cursor-not-allowed disabled:opacity-35"
        >
          {submitting ? 'Saving…' : compact ? 'Save & show confirmation options' : 'Confirm & go to calendar'}
        </button>
      </div>
    </motion.section>
  );

  if (compact) {
    return <div className="mt-10 space-y-4">{formCard}</div>;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <InvestorAtmosphere />
      <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,242,255,0.06)_0%,transparent_50%,rgba(0,0,0,0.85)_100%)]" />

      <div className="relative z-20 mx-auto max-w-3xl px-4 py-10 pb-28 md:py-14">
        <Link href="/start" className="parable-eyebrow mb-4 inline-block hover:text-[#00f2ff]">
          ← Choice hub
        </Link>
        <ReturnToProposalDeck className="mb-8" />

        <ParableLogoMark className="mx-auto mb-8 max-w-[200px] opacity-95 md:max-w-xs" />

        <div className="text-center">
          <p className="parable-eyebrow mb-2 text-[#00f2ff]/85">Investor relations</p>
          <h1 className="text-2xl font-black uppercase tracking-[0.18em] text-white md:text-3xl md:tracking-[0.22em]">
            Book a meeting
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/45">
            Register below (NDA on file). Next, you will <strong className="text-white/60">choose a time</strong> in the
            calendar, then you can have our confirmation email with your{' '}
            <strong className="text-white/60">video room and meeting details</strong>.
          </p>
        </div>

        <div className="mt-10">{formCard}</div>

        <p className="mt-8 text-center text-xs text-white/30">
          After this step, you will pick a time, then you can request the Parable email with your room and join link.
        </p>
      </div>
    </div>
  );
}
