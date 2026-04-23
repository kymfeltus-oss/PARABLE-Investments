'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';
import { mergeBookMeetingSession, type BookMeetingSessionPayload } from '@/lib/book-meeting-session';

const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL?.trim() || 'investors@parableinvestments.com';

type Props = {
  embedSrc: string | null;
  emailStatus: BookMeetingSessionPayload['emailStatus'];
  resendErrorMessage: string | null;
  roomLabel: string | null;
  roomSuffix: string | null;
  meetUrl: string | null;
  registrationId: string | null;
  contactEmail: string | null;
  /** “Book a meeting” when finishing from redirect; omit on /book if ever inlined again */
  backHref?: string;
  backLabel?: string;
};

function EmailOutcomeBlock({
  viewStatus,
  resendErrorMessage,
  showDeferredHint,
}: {
  viewStatus: BookMeetingSessionPayload['emailStatus'];
  resendErrorMessage: string | null;
  showDeferredHint: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#00f2ff]/25 bg-[#00f2ff]/[0.06] px-5 py-6 text-center md:px-8">
      {viewStatus === 'deferred' && showDeferredHint ? (
        <>
          <p className="font-serif text-lg text-white md:text-xl">Parable confirmation email</p>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            We have not sent your <strong className="text-white/80">Parable</strong> confirmation yet. When you are ready
            (ideally <strong className="text-white/80">after</strong> you pick a time in the calendar above), use the
            button below. We will email your <strong className="text-white/80">video room, meeting ID, and .ics</strong> to
            the address you registered.
          </p>
        </>
      ) : null}
      {viewStatus === 'deferred' && !showDeferredHint ? (
        <>
          <p className="font-serif text-lg text-white md:text-xl">Parable confirmation email</p>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            This site is not showing an embedded calendar. Use the link you received from your calendar provider, if any,
            then use the button below to receive the Parable email with your video room and meeting details.
          </p>
        </>
      ) : null}
      {viewStatus === 'sent' || viewStatus === 'already_sent' ? (
        <>
          <p className="font-serif text-lg text-white md:text-xl">Check your email</p>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-white/55">
            <p>
              Our mail provider accepted the confirmation. Please check your inbox, <strong className="text-white/70">Promotions</strong> (Gmail), and{' '}
              <strong className="text-white/70">spam</strong> over the next few minutes.
            </p>
            <p className="text-[13px] text-white/45">
              If nothing arrives, the sending domain may still need verification in Resend, or the provider may be delaying. Use
              the calendar above if needed, or email{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium text-[#00f2ff]/90 underline decoration-[#00f2ff]/40 underline-offset-2 hover:text-[#00f2ff]"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        </>
      ) : null}
      {viewStatus === 'failed' ? (
        <div className="mt-0 space-y-3 text-left text-sm leading-relaxed text-amber-100/90">
          <p className="text-center font-serif text-lg text-white">Email could not be sent</p>
          <p>
            We could not send the <strong>Parable</strong> confirmation. This site uses <strong>Resend</strong> to deliver
            mail. Check <code className="rounded bg-black/40 px-1 text-[12px] text-amber-50/95">RESEND_API_KEY</code> and{' '}
            <code className="rounded bg-black/40 px-1 text-[12px] text-amber-50/95">RESEND_FROM_EMAIL</code> in Vercel, then
            use &quot;Try again&quot; or contact{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-medium text-[#00f2ff]/90 underline decoration-[#00f2ff]/40 underline-offset-2 hover:text-[#00f2ff]"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          {resendErrorMessage ? (
            <p className="rounded-lg border border-amber-500/30 bg-amber-950/40 p-3 font-mono text-[12px] leading-snug text-amber-50/95">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-200/80">Resend said</span>
              <br />
              {resendErrorMessage}
            </p>
          ) : null}
        </div>
      ) : null}
      {viewStatus === 'unconfigured' ? (
        <>
          <p className="font-serif text-lg text-white">Parable email not sending</p>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            <strong>Resend</strong> is not fully configured, so the confirmation could not be sent. Your registration is
            still saved. Contact{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-medium text-[#00f2ff]/90 underline decoration-[#00f2ff]/40 underline-offset-2 hover:text-[#00f2ff]"
            >
              {SUPPORT_EMAIL}
            </a>{' '}
            for your room details, or configure Resend in the host and try again.
          </p>
        </>
      ) : null}
    </div>
  );
}

export function BookMeetingPostRegisterView({
  embedSrc,
  emailStatus: initialStatus,
  resendErrorMessage: initialResend,
  roomLabel,
  roomSuffix,
  meetUrl,
  registrationId,
  contactEmail,
  backHref = '/start',
  backLabel = '← Back to choice hub',
}: Props) {
  const [sending, setSending] = useState(false);
  const [viewStatus, setViewStatus] = useState<BookMeetingSessionPayload['emailStatus']>(initialStatus);
  const [resendErrorMessage, setResendErrorMessage] = useState<string | null>(initialResend);

  const canRequestEmail =
    (viewStatus === 'deferred' || viewStatus === 'unconfigured' || viewStatus === 'failed') &&
    Boolean(registrationId) &&
    contactEmail != null &&
    isValidInvestorEmail(contactEmail);

  async function onSendConfirmation() {
    if (!registrationId || !contactEmail) return;
    setSending(true);
    setResendErrorMessage(null);
    try {
      const res = await fetch('/api/meeting/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId, email: contactEmail }),
      });
      const data = (await res.json()) as {
        error?: string;
        emailStatus?: string;
        resendErrorMessage?: string | null;
      };
      if (!res.ok) {
        setResendErrorMessage(data.error || 'Request failed. Try again.');
        setViewStatus('failed');
        mergeBookMeetingSession({
          emailStatus: 'failed',
          resendErrorMessage: data.error || 'Request failed.',
        });
        return;
      }
      const st = data.emailStatus as BookMeetingSessionPayload['emailStatus'] | undefined;
      if (st === 'sent' || st === 'already_sent') {
        setViewStatus('sent');
        mergeBookMeetingSession({
          emailStatus: st,
          resendErrorMessage: null,
        });
      } else if (st === 'failed' || st === 'unconfigured') {
        setViewStatus(st);
        setResendErrorMessage(typeof data.resendErrorMessage === 'string' ? data.resendErrorMessage : null);
        mergeBookMeetingSession({
          emailStatus: st,
          resendErrorMessage: typeof data.resendErrorMessage === 'string' ? data.resendErrorMessage : null,
        });
      } else {
        setViewStatus('unconfigured');
        mergeBookMeetingSession({ emailStatus: 'unconfigured' });
      }
    } catch {
      setViewStatus('failed');
      setResendErrorMessage('Network error.');
      mergeBookMeetingSession({ emailStatus: 'failed', resendErrorMessage: 'Network error.' });
    } finally {
      setSending(false);
    }
  }

  const showDeferredHint = Boolean(embedSrc);
  const showCta = (viewStatus === 'deferred' || viewStatus === 'unconfigured') && canRequestEmail;
  const showFailedRetry = viewStatus === 'failed' && canRequestEmail;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-10 space-y-10">
      {embedSrc ? (
        <section
          id="book-schedule-embed"
          className="rounded-2xl border border-white/[0.12] bg-white/[0.03] p-4 shadow-[0_8px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-6"
        >
          <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#00f2ff]/85">Step 2 — Choose a time</h2>
          <p className="mt-2 text-sm text-white/50">
            Pick a slot. Your provider may send a separate message with the date and time. Then request your Parable
            confirmation below for the video room and room ID.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <iframe
              title="Schedule a meeting"
              src={embedSrc}
              className="h-[min(720px,80vh)] w-full border-0"
              loading="lazy"
            />
          </div>
        </section>
      ) : null}

      {roomSuffix || roomLabel || meetUrl ? (
        <div className="rounded-2xl border border-white/[0.1] bg-black/35 p-5 text-left md:p-6">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#00f2ff]/85">Your video meeting</h2>
          <p className="mt-1 text-sm text-white/50">
            This room is for <strong className="text-white/80">this</strong> booking. It is also in your Parable
            confirmation email.
          </p>
          {roomLabel ? <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Host / meeting ID (full)</p> : null}
          {roomLabel ? <p className="mt-1 break-all font-mono text-sm text-[#00f2ff]/90">{roomLabel}</p> : null}
          {roomSuffix ? <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-white/40">Room suffix (after investor-)</p> : null}
          {roomSuffix ? <p className="mt-1 font-mono text-sm text-white/80">{roomSuffix}</p> : null}
          {meetUrl ? (
            <a
              href={meetUrl}
              className="mt-4 inline-block text-sm font-medium text-[#00f2ff] underline decoration-[#00f2ff]/50 underline-offset-2 hover:text-[#00f2ff]/90"
            >
              Open meet link
            </a>
          ) : null}
        </div>
      ) : null}

      <EmailOutcomeBlock
        viewStatus={viewStatus}
        resendErrorMessage={resendErrorMessage}
        showDeferredHint={viewStatus === 'deferred' ? showDeferredHint : true}
      />

      {showCta || showFailedRetry ? (
        <div className="text-center">
          <button
            type="button"
            disabled={sending}
            onClick={() => void onSendConfirmation()}
            className="w-full max-w-md rounded-xl border border-[#00f2ff]/50 bg-[#00f2ff]/15 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#00f2ff] transition hover:bg-[#00f2ff]/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending
              ? 'Sending…'
              : showFailedRetry
                ? 'Try confirmation email again'
                : viewStatus === 'unconfigured'
                  ? 'Send Parable confirmation email'
                  : 'Email me the Parable confirmation & room details'}
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 text-center sm:flex-row sm:justify-center sm:gap-6">
        <Link
          href="/book"
          className="text-xs uppercase tracking-[0.2em] text-white/35 hover:text-[#00f2ff]/80"
        >
          ← Register again
        </Link>
        <Link href={backHref} className="text-xs uppercase tracking-[0.2em] text-white/35 hover:text-[#00f2ff]/80">
          {backLabel}
        </Link>
      </div>
    </motion.div>
  );
}
