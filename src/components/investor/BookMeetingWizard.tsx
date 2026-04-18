'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { InvestorAtmosphere } from '@/components/brand/InvestorAtmosphere';
import { ParableLogoMark } from '@/components/brand/ParableLogoMark';
import { INVESTOR_AGREEMENT_VERSION } from '@/lib/investor-agreement-text';
import { isValidInvestorEmail } from '@/lib/investor-agreement-validation';

type Props = {
  meetUrl: string;
  roomLabel: string;
  embedSrc: string | null;
};

export function BookMeetingWizard({ meetUrl, roomLabel, embedSrc }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ack, setAck] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const canRegister =
    name.trim().length >= 2 && isValidInvestorEmail(email.trim()) && ack && !submitting;

  const copyMeet = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(meetUrl);
    } catch {
      /* ignore */
    }
  }, [meetUrl]);

  const onRegister = useCallback(async () => {
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
        }),
      });
      const data = (await res.json()) as { error?: string; ok?: boolean; emailSent?: boolean };
      if (!res.ok || !data.ok) {
        setError(data.error || 'Something went wrong. Try again.');
        setSubmitting(false);
        return;
      }
      setEmailSent(Boolean(data.emailSent));
      setRegistered(true);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSubmitting(false);
    }
  }, [canRegister, name, email]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <InvestorAtmosphere />
      <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,242,255,0.06)_0%,transparent_50%,rgba(0,0,0,0.85)_100%)]" />

      <div className="relative z-20 mx-auto max-w-3xl px-4 py-10 pb-28 md:py-14">
        <Link href="/start" className="parable-eyebrow mb-8 inline-block hover:text-[#00f2ff]">
          ← Choice hub
        </Link>

        <ParableLogoMark className="mx-auto mb-8 max-w-[200px] opacity-95 md:max-w-xs" />

        <div className="text-center">
          <p className="parable-eyebrow mb-2 text-[#00f2ff]/85">Investor relations</p>
          <h1 className="text-2xl font-black uppercase tracking-[0.18em] text-white md:text-3xl md:tracking-[0.22em]">
            Book a meeting
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/45">
            Confirm who you are (for our NDA records), receive email with the video room link, then choose a time in the
            calendar.
          </p>
        </div>

        {!registered ? (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-2xl border border-white/[0.12] bg-black/40 p-6 shadow-[0_8px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-8"
          >
            <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#00f2ff]/85">Step 1 — Register</h2>
            <p className="mt-2 text-sm text-white/50">
              We store this with NDA version <span className="text-white/70">{INVESTOR_AGREEMENT_VERSION}</span> as
              scheduling evidence, then email you meeting access details.
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
                <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Work email</span>
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
                  I confirm this investor meeting request is subject to the same confidentiality obligations as my Parable
                  NDA / electronic acknowledgment (version {INVESTOR_AGREEMENT_VERSION}). I understand Parable will retain
                  this registration as supplemental evidence.
                </span>
              </label>
              {error ? <p className="text-sm text-red-300/95">{error}</p> : null}
              <button
                type="button"
                disabled={!canRegister}
                onClick={onRegister}
                className="w-full rounded-xl border border-[#00f2ff]/40 bg-[#00f2ff]/10 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#00f2ff] transition hover:bg-[#00f2ff]/20 disabled:cursor-not-allowed disabled:opacity-35"
              >
                {submitting ? 'Saving…' : 'Email confirmation & continue'}
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-10 space-y-10">
            <div className="rounded-2xl border border-[#00f2ff]/25 bg-[#00f2ff]/[0.06] px-5 py-6 text-center md:px-8">
              <p className="font-serif text-lg text-white md:text-xl">Check your inbox</p>
              {emailSent ? (
                <p className="mt-3 text-sm text-white/55">
                  We sent meeting confirmation and video login details to{' '}
                  <span className="text-[#00f2ff]/90">{email}</span>, including your NDA scheduling record and LiveKit
                  room link.
                </p>
              ) : (
                <p className="mt-3 text-sm text-white/55">
                  Your registration was saved. Configure <code className="text-[#00f2ff]/85">RESEND_API_KEY</code> and{' '}
                  <code className="text-[#00f2ff]/85">RESEND_FROM_EMAIL</code> to enable confirmation emails. Video link is
                  below.
                </p>
              )}
            </div>

            {embedSrc ? (
              <section className="rounded-2xl border border-white/[0.12] bg-white/[0.03] p-4 shadow-[0_8px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-6">
                <h2 className="text-xs font-black uppercase tracking-[0.28em] text-[#00f2ff]/85">Step 2 — Choose a time</h2>
                <p className="mt-2 text-sm text-white/50">
                  Pick an open slot. Your calendar app will usually send a separate time confirmation—use the Parable
                  video link from our email at that time.
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
            ) : (
              <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 px-5 py-5 text-center text-sm text-amber-100/90">
                Calendar embed is not configured. Set <code className="text-[#00f2ff]/90">NEXT_PUBLIC_SCHEDULING_URL</code>{' '}
                (Cal.com) or <code className="text-[#00f2ff]/90">NEXT_PUBLIC_SCHEDULING_EMBED_URL</code> in the host
                environment.
              </div>
            )}

            <MeetLinkPanel meetUrl={meetUrl} roomLabel={roomLabel} onCopy={copyMeet} />

            <Link
              href="/start"
              className="block text-center text-xs uppercase tracking-[0.2em] text-white/35 hover:text-[#00f2ff]/80"
            >
              ← Back to choice hub
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function MeetLinkPanel({
  meetUrl,
  roomLabel,
  onCopy,
}: {
  meetUrl: string;
  roomLabel: string;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#00f2ff]/20 bg-[#00f2ff]/[0.06] px-4 py-4 text-left">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00f2ff]/75">Video room (LiveKit)</p>
      <p className="mt-2 break-all font-mono text-xs text-[#00f2ff]/90">{meetUrl}</p>
      <p className="mt-2 text-[11px] text-white/45">
        Room: <span className="text-white/70">{roomLabel}</span> — at the meeting time, open the link, enter your display
        name, then connect.
      </p>
      <button
        type="button"
        onClick={onCopy}
        className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#00f2ff] hover:underline"
      >
        Copy video link
      </button>
    </div>
  );
}
