'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL?.trim() || 'investors@parableinvestments.com';

type Props = {
  embedSrc: string | null;
  emailStatus: 'sent' | 'unconfigured' | 'failed';
  resendErrorMessage: string | null;
  roomLabel: string | null;
  roomSuffix: string | null;
  meetUrl: string | null;
  /** “Book a meeting” when finishing from redirect; omit on /book if ever inlined again */
  backHref?: string;
  backLabel?: string;
};

export function BookMeetingPostRegisterView({
  embedSrc,
  emailStatus,
  resendErrorMessage,
  roomLabel,
  roomSuffix,
  meetUrl,
  backHref = '/start',
  backLabel = '← Back to choice hub',
}: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-10 space-y-10">
      <div className="rounded-2xl border border-[#00f2ff]/25 bg-[#00f2ff]/[0.06] px-5 py-6 text-center md:px-8">
        <p className="font-serif text-lg text-white md:text-xl">Check your email</p>
        {emailStatus === 'sent' ? (
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-white/55">
            <p>
              Our mail provider accepted the confirmation. Please check your inbox, <strong className="text-white/70">Promotions</strong> (Gmail), and{' '}
              <strong className="text-white/70">spam</strong> over the next few minutes.
            </p>
            <p className="text-[13px] text-white/45">
              If nothing arrives, the sending domain may still need verification in Resend, or the provider may be delaying.
              Use the calendar below or email{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium text-[#00f2ff]/90 underline decoration-[#00f2ff]/40 underline-offset-2 hover:text-[#00f2ff]"
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        ) : emailStatus === 'failed' ? (
          <div className="mt-3 space-y-3 text-left text-sm leading-relaxed text-amber-100/90">
            <p>
              Your registration was saved, but the <strong>confirmation email was not sent</strong>. This site uses{' '}
              <strong>Resend</strong> to deliver mail to the address you entered. You do <strong>not</strong> need “Enable
              Receiving” / inbound MX in Resend for the guest to get this message—only a verified
              <strong> sending</strong> domain and correct env on Vercel (
              <code className="rounded bg-black/40 px-1 text-[12px] text-amber-50/95">RESEND_API_KEY</code>,{' '}
              <code className="rounded bg-black/40 px-1 text-[12px] text-amber-50/95">RESEND_FROM_EMAIL</code>).
            </p>
            {resendErrorMessage ? (
              <p className="rounded-lg border border-amber-500/30 bg-amber-950/40 p-3 font-mono text-[12px] leading-snug text-amber-50/95">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-200/80">Resend said</span>
                <br />
                {resendErrorMessage}
              </p>
            ) : null}
            <p>
              Please use the calendar below if it appears, or email{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium text-[#00f2ff]/90 underline decoration-[#00f2ff]/40 underline-offset-2 hover:text-[#00f2ff]"
              >
                {SUPPORT_EMAIL}
              </a>
              , and check the Resend dashboard (Emails / Logs) for the same error.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Your registration was saved. An automated confirmation email was not sent from this site (mail may not be
            configured yet). Use the calendar below when it appears, or contact{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-medium text-[#00f2ff]/90 underline decoration-[#00f2ff]/40 underline-offset-2 hover:text-[#00f2ff]"
            >
              {SUPPORT_EMAIL}
            </a>{' '}
            so we can confirm and send your meeting details.
          </p>
        )}
      </div>

      {roomSuffix || roomLabel || meetUrl ? (
        <div className="rounded-2xl border border-white/[0.1] bg-black/35 p-5 text-left md:p-6">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#00f2ff]/85">Your video meeting</h2>
          <p className="mt-1 text-sm text-white/50">
            This is generated for <strong className="text-white/80">this</strong> request — use the same room when you
            join. It is also in your confirmation email.
          </p>
          {roomLabel ? (
            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Host / meeting ID (full)</p>
          ) : null}
          {roomLabel ? <p className="mt-1 break-all font-mono text-sm text-[#00f2ff]/90">{roomLabel}</p> : null}
          {roomSuffix ? (
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-white/40">Room suffix (after investor-)</p>
          ) : null}
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

      {embedSrc ? (
        <section
          id="book-schedule-embed"
          className="rounded-2xl border border-white/[0.12] bg-white/[0.03] p-4 shadow-[0_8px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-6"
        >
          <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#00f2ff]/85">Choose a time</h2>
          <p className="mt-2 text-sm text-white/50">
            Pick an open slot on this page to finish booking. Your calendar app may send a separate confirmation for the
            time.
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
